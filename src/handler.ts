"use strict";
import fs = require("fs");
import { format } from "util";

import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import { MongoClient } from "mongodb";
import fetch from "node-fetch";

import { IErrorResponse, ISuccessResponse } from "./interfaces/Api.interfaces";
import { IWikiJson } from "./interfaces/WikiApi.interfaces";
import { WikiSection } from "./interfaces/WikiSection";
// import { connectToDB, notFound, redirect, success } from "./lib/db";

export const wikiPageHandler: Handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<ISuccessResponse | IErrorResponse> => {
  return new Promise((resolve, reject) => {
    let pageTag;
    let lang;

    // validate that page_tag and language are passed as query parameters
    if (
      !(
        event.queryStringParameters &&
        event.queryStringParameters.page_tag &&
        event.queryStringParameters.language
      )
    ) {

      resolve({
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        },
        body: JSON.stringify({
          error: "Missing mandatory params",
        }),
      });
    } else {
      pageTag = event.queryStringParameters.page_tag;
      lang = event.queryStringParameters.language;

      // validate language
      const wikiLangsContent = fs.readFileSync("wiki-lang.json").toString();
      const wikiLangs: string[] = JSON.parse(wikiLangsContent);
      console.log(`[wiki langs] ${wikiLangs}`);
      if (!wikiLangs.includes(lang)) {
        resolve({
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          },
          body: JSON.stringify({
            error: "Invalid language",
          }),
        });
      } else {
        /**
         *  Check for results in db
         *
         */
        /*
        dbClient = await connectToDB();
        //Specify the collection to be used
        const col = db.collection("col");
*/
        // else make new request to wikimedia
        const url: string = `https://${lang}.wikipedia.org/w/api.php?action=parse&page=${pageTag}&prop=wikitext&format=json`;
        fetch(url)
          .then((wikiRes) => wikiRes.json())
          .then((wikiResBody: IWikiJson) => {
            if ("error" in wikiResBody) {
              resolve({
                statusCode: 404,
                headers: {
                  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                },
                body: JSON.stringify({
                  error: "Page not found",
                }),
              });
            } else {
              if (wikiResBody.parse) {
                const wikipage = new WikiSection(
                  wikiResBody.parse.wikitext!["*"],
                  1,
                );
                wikipage.distill();

                const response: ISuccessResponse = {
                  statusCode: 200,
                  headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                  },
                  body: JSON.stringify({
                    title: wikiResBody.parse.title,
                    pageid: wikiResBody.parse.pageid,
                    distilledtext: wikipage.show(),
                    wikitext: wikiResBody.parse.wikitext["*"],
                  }),
                };
                resolve(response);
              }
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    }
  });
};

export const defaultHandler: Handler = (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "Ahoy, Default handler here!",
    }),
  };

  callback(null, response);
};
