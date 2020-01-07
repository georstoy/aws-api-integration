"use strict";
import { Handler, Context, Callback } from "aws-lambda";
import fetch from "node-fetch";
import { Response } from "node-fetch";
import {
  WikiJson,
  WikiPage,
  ApiResponse,
  WikiText,
  WikiSection,
  
} from "./handler.interface";
import { short } from "./debug-utils";

const wikiPageHandler: Handler = async (
  event: any,
  context: Context
  ): Promise<ApiResponse> => {
    const pageTag = event.queryStringParameters.page_tag;
    const lang = event.queryStringParameters.language;
    const url: string = `https://${lang}.wikipedia.org/w/api.php?action=parse&page=${pageTag}&prop=wikitext&format=json`;
  
    return new Promise( (resolve,reject) => {
      fetch(url)
        .then(res => res.json())
        .then( (body: WikiJson) => {
          
          let distilledtext = new WikiSection(body.parse.wikitext['*'], 1);
          console.log(`[pre-destill] ${short(distilledtext.toString())}`);
          distilledtext.distill();
          console.log(`[post-destill] ${short(distilledtext.toString())}`);

          const wikiPage: WikiPage = {
            title: body.parse.title,
            pageid: body.parse.pageid,
            wikitext: body.parse.wikitext['*'],
            distilledtext
          };
          const response: ApiResponse = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: wikiPage
          }
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
    
};

const defaultHandler: Handler = (
  event: any,
  context: Context,
  callback: Callback
) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "Ahoy, Default handler here!"
    })
  };

  callback(null, response);
};

export { wikiPageHandler, defaultHandler };
