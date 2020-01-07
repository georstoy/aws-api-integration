"use strict";
import { Handler, Context, Callback } from "aws-lambda";
import fetch from "node-fetch";
import { Response } from "node-fetch";
import {
  WikiJson,
  WikiText,
  WikiSection,
  WikiPage
} from "./handler.interface";

const wikiPageHandler: Handler = async (
  event: any,
  context: Context
  ): Promise<WikiPage> => {
    const pageTag = event.queryStringParameters.page_tag;
    const lang = event.queryStringParameters.language;
    const url: string = `https://${lang}.wikipedia.org/w/api.php?action=parse&page=${pageTag}&prop=wikitext&format=json`;
  
    return new Promise( (resolve,reject) => {
      fetch(url)
        .then(res => res.json())
        .then( (body: WikiJson) => {
          console.log(body);
          

          resolve({
            title: body.parse.title,
            pageid: body.parse.pageid,
            wikitext: body.parse.wikitext['*'],
            distilledtext: 'TODO'
          });
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
