import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import portfinder from "portfinder";
import config from "./conf/conf";
import { connection } from "mongoose";
import { SolrClient } from "./solr/SolrClient";
import { PingResponse } from "./types/solr";
import { SolrPingError } from "./errors/errors";
import { BlobOptions } from "buffer";

const app = express();
app
  .disable("x-powered-by")
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors());

app.get("/health", async (req: Request, res: Response) => {
  let solrHealthy: boolean = false;
  const pingOp = new SolrClient(8.5).collectionOperation.preparePing("bartoc");

  try {
    const isAlive = await pingOp.execute<PingResponse>();
    config.log?.("✅ Solr is reachable with status", isAlive.status);
    solrHealthy = isAlive.status === "OK";
  } catch (error) {
    config.error?.("❌ Solr request failed");
    throw new SolrPingError();
  }

  res.json({
    ok: true,
    mongoConnected: connection.readyState === 1,
    solrConnected: solrHealthy,
  });
});

export const startServer = async () => {
  if (config.env == "test") {
    portfinder.basePort = config.port;
    config.port = await portfinder.getPortPromise();
  }
  app.listen(config.port, () => {
    console.log(`Now listening on port ${config.port}`);
  });
};
