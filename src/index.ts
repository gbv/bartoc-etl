import { startServer } from "./server";
import { connect } from "./mongo/mongo";
import { watchTerminologies } from "./mongo/watchTerminologies";
import { SolrClient } from "./solr/SolrClient";
import config from "./conf/conf";
import { PingResponse } from "./types/solr";
import { SolrPingError } from "./errors/errors";

const startDB = async () => {
  // passing true means that retry is active
  await connect(true);
  // Watching for changes in realt time, only for inserting events
  await watchTerminologies();
};
// Startig and try connection to the mongodb instance
startDB();

// Starting the server without wait for mongodb connection
export const server = startServer();
