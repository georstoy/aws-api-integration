"use strict";
import { Handler, Context, Callback } from "aws-lambda";

const wikiPageHandler: Handler = (
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
      message: "Ahoy, WikiPage handler here!"
    })
  };

  callback(null, response);
};

export { wikiPageHandler };
