"use strict";
import fs = require("fs");

import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
import fetch from "node-fetch";
import { Response } from "node-fetch";
import { short } from "./debug-utils";
import { IErrorResponse, ISuccessResponse } from "./interfaces/Api.interfaces";
import { IWikiJson } from "./interfaces/WikiApi.interfaces";
import { WikiSection } from "./interfaces/WikiSection";
import { WikiText } from "./interfaces/WikiText";

const wikiPageHandler: Handler = async (
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
      const wikiLangs: string[] = [
        "ab",
        "ace",
        "ady",
        "af",
        "ak",
        "als",
        "am",
        "an",
        "ang",
        "ar",
        "arc",
        "arz",
        "as",
        "ast",
        "atj",
        "av",
        "ay",
        "az",
        "azb",
        "ba",
        "bal",
        "bar",
        "bat-smg",
        "bcl",
        "be",
        "be-x-old",
        "bg",
        "bgn",
        "bh",
        "bi",
        "bjn",
        "bm",
        "bn",
        "bo",
        "bpy",
        "br",
        "bs",
        "bug",
        "bxr",
        "ca",
        "cbk-zam",
        "cdo",
        "ce",
        "ceb",
        "ch",
        "chr",
        "chy",
        "ckb",
        "co",
        "cr",
        "crh",
        "cs",
        "csb",
        "cu",
        "cv",
        "cy",
        "da",
        "de",
        "din",
        "diq",
        "dsb",
        "dty",
        "dv",
        "dz",
        "ee",
        "el",
        "eml",
        "en",
        "eo",
        "es",
        "et",
        "eu",
        "ext",
        "fa",
        "ff",
        "fi",
        "fiu-vro",
        "fj",
        "fo",
        "fr",
        "frp",
        "frr",
        "fur",
        "fy",
        "ga",
        "gag",
        "gan",
        "gd",
        "gl",
        "glk",
        "gn",
        "gom",
        "gor",
        "got",
        "gu",
        "gu",
        "gv",
        "ha",
        "hak",
        "haw",
        "he",
        "hi",
        "hif",
        "hr",
        "hsb",
        "ht",
        "hu",
        "hy",
        "ia",
        "id",
        "ie",
        "ig",
        "ik",
        "ilo",
        "inh",
        "io",
        "is",
        "it",
        "iu",
        "ja",
        "jam",
        "jbo",
        "jv",
        "ka",
        "kaa",
        "kab",
        "kbd",
        "kbp",
        "kg",
        "khw",
        "ki",
        "kk",
        "kl",
        "km",
        "kn",
        "ko",
        "koi",
        "krc",
        "ks",
        "ksh",
        "ku",
        "kv",
        "kw",
        "ky",
        "la",
        "lad",
        "lb",
        "lbe",
        "lez",
        "lfn",
        "lg",
        "li",
        "lij",
        "lmo",
        "ln",
        "lo",
        "lrc",
        "lt",
        "ltg",
        "lv",
        "mai",
        "map-bms",
        "mdf",
        "mg",
        "mhr",
        "mi",
        "min",
        "mk",
        "ml",
        "mn",
        "mr",
        "mrj",
        "ms",
        "mt",
        "mwl",
        "my",
        "myv",
        "mzn",
        "na",
        "nah",
        "nap",
        "nds",
        "nds-nl",
        "ne",
        "new",
        "nl",
        "nn",
        "no",
        "nov",
        "nrm",
        "nso",
        "nv",
        "ny",
        "oc",
        "olo",
        "om",
        "or",
        "os",
        "pa",
        "pag",
        "pam",
        "pap",
        "pcd",
        "pdc",
        "pfl",
        "pi",
        "pih",
        "pl",
        "pms",
        "pnb",
        "pnt",
        "ps",
        "pt",
        "qu",
        "rm",
        "rmy",
        "rn",
        "ro",
        "roa-rup",
        "roa-tara",
        "ru",
        "rue",
        "rw",
        "sa",
        "sah",
        "sat",
        "sc",
        "scn",
        "sco",
        "sd",
        "se",
        "sg",
        "sh",
        "si",
        "simple",
        "sk",
        "sl",
        "sm",
        "sn",
        "so",
        "sq",
        "sr",
        "srn",
        "ss",
        "st",
        "stq",
        "su",
        "sv",
        "sw",
        "szl",
        "ta",
        "tcy",
        "te",
        "tet",
        "tg",
        "th",
        "ti",
        "tk",
        "tl",
        "tn",
        "to",
        "tpi",
        "tr",
        "ts",
        "tt",
        "tum",
        "tw",
        "ty",
        "tyv",
        "udm",
        "ug",
        "uk",
        "ur",
        "uz",
        "ve",
        "vec",
        "vep",
        "vi",
        "vls",
        "vo",
        "wa",
        "war",
        "wo",
        "wuu",
        "xal",
        "xh",
        "xmf",
        "yi",
        "yo",
        "za",
        "zea",
        "zh",
        "zh-classical",
        "zh-min-nan",
        "zh-yue",
        "zu",
      ];
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

const defaultHandler: Handler = (
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

export { wikiPageHandler, defaultHandler };
