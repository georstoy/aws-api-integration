/*import { MongoClient } from "mongodb";
import { format } from "util";
import fs = require("fs");

export const connectToDB = () => {
  return new Promise((resolve, reject) => {
    //Specify the Amazon DocumentDB cert (needed when TLS is enabled)
    const ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];
    //Create a MongoDB client, open a connection to Amazon DocumentDB as a replica set,
    //  and specify the read preference as secondary preferred
    const region = process.env.APP_REGION || "eu-west-1";
    const dbUser = process.env.DB_MASTER_USER || "wikiroot";
    const dbPass = process.env.DB_MASTER_USER_PASSWORD || "wikisupersecret";
    const dbUrl = process.env.DB_URL || `mongodb://${dbUser}:${dbPass}@mycluster.node.${region}.docdb.amazonaws.com:27017/test?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred`;

    const client = MongoClient.connect(
      dbUrl,
      {
        sslValidate: true,
        sslCA: ca,
        useNewUrlParser: true
      },
      function(err, client) {
        if (err) reject(err);
        
        //Specify the database to be used
        const db = client.db("wiki-results");
        resolve(db);
      }
    );
  });
};

export const success = () => {};

export const redirect = () => {};

export const notFound = () => {};
*/