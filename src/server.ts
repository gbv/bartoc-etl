import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import portfinder from "portfinder";
import config from "./conf/conf";
import { connection } from "mongoose";
import * as solr from "./solr/solr";

const app = express();
app
  .disable("x-powered-by")
  .use(morgan("dev"))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors());

app.get("/health", async (req: Request, res: Response) => {
  const solrHealthy = solr.isSolrReady();

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
