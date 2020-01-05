"use strict";
import { Handler, Context, Callback } from "aws-lambda";
import fetch from "node-fetch";
import { Response } from "node-fetch";
import {
  WikiJson,
  WikiText,
  wikiPageHandlerResponse
} from "./handler.interface";
import { SpaceDelimitedTextPattern } from "@aws-cdk/aws-logs";

const wikiPageHandler: Handler = async (
  event: any,
  context: Context) => {
    const pageTag = event.queryStringParameters.page_tag;
    const lang = event.queryStringParameters.language;
    const url: string = `https://${lang}.wikipedia.org/w/api.php?action=parse&page=${pageTag}&prop=wikitext&format=json`;
  
    return new Promise( (resolve,reject) => {
      fetch(url)
        .then(response => response.json())
        .then(body => {
          resolve(body);
        })
        .catch(err => {
          reject(err);
        });
    });
    
  // Place for query parameters internal valdation
/*
  // fetch wikipage
  const url: string = `https://${lang}.wikipedia.org/w/api.php?action=parse&page=${pageTag}&prop=wikitext&format=json`;
  let body: string;
  let statusCode: number;
  let response: wikiPageHandlerResponse;

  console.log(`fetch ${url}`);
  
  /*
  fetch(url)
    .then((res: Response) => {
      console.log('Got Wiki response');
      if (!res.ok) {
        // Page not found
        console.log('Bad Wiki response!')
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((resJson: WikiJson) => {
      console.log(`response json ${resJson}`);
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          title: resJson.parse.title,
          pageid: resJson.parse.pageid,
          //distiledtext: this.parseWikiPageToJson(resJson.parse.wikitext["*"]),
          wikitext: resJson.parse.wikitext["*"]
        })
      });
    })
    .catch((error: any) => {
      callback(null, {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: JSON.stringify({
          error
        })
      });
    });
  */
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
