import { Worker, Job } from "bullmq";
import config from "../conf/conf";
import { Queue } from "./queue";
import type { SolrJobPayload } from "../types/solr";
import { processTerminologyJob } from "./processTerminologyJob";

// Initialize (or retrieve) the BullMQ queue (async)
const terminologiesQueuePromise = Queue<SolrJobPayload>("terminologiesQueue");
export async function getTerminologiesQueue() {
  return await terminologiesQueuePromise;
}

async function startWorker() {
  const terminologiesQueue = await terminologiesQueuePromise;
  if (!terminologiesQueue) {
    config.error?.("terminologiesQueue not started: Redis unavailable");
    return;
  }

  // Pull concurrency & rate‐limiter from config
  const qc = config.queues?.terminologiesQueue;
  const workerOpts = {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
      lazyConnect: true,
      enableOfflineQueue: false, // <- no buffering: immediate error if disconnected
    },
    concurrency: qc?.concurrency ?? 20,
    limiter: qc?.limiter ?? { max: 100, duration: 1000 },
  };

  // Keep BullMQ wiring here and delegate payload handling to a testable function.
  const terminologiesWorker = new Worker<SolrJobPayload>(
    terminologiesQueue.name,
    async (job: Job<SolrJobPayload>) => processTerminologyJob(job.data),
    workerOpts,
  );

  // Optional: hook metrics or detailed logging here
  terminologiesWorker.on("completed", (job) => {
    config.log?.(
      `[Worker] Job ${job.id} completed in ${job.finishedOn! - job.processedOn!}ms`,
    );
  });

  terminologiesWorker.on("failed", (job, err) => {
    config.error?.(`[Worker] Job ${job?.id} failed: ${err.message}`);
  });
}

startWorker();
