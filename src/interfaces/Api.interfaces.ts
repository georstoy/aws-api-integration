import { IDistilledWikiText } from "./WikiSection";

export interface ISuccessResponseBody {
    title: string;
    pageid: number;
    wikitext: string;
    distilledtext: IDistilledWikiText;
  }
  
  export interface ISuccessResponse {
    statusCode: number;
    headers: object;
    body: string;
  }

  export interface IErrorBody {
    error: string;
  }
  
  export interface IErrorResponse {
    statusCode: number;
    headers: object;
    body: string;
  }