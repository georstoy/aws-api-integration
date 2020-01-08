export interface IWikiError {
    code: string;
    info: string;
    "'*'": string;
  }
  
  export interface IWikiParse {
    title: string;
    pageid: number;
    wikitext: {
      "*": string;
    };
  }
  export interface IWikiJson {
    parse?: IWikiParse;
    error?: IWikiError;
  }
  