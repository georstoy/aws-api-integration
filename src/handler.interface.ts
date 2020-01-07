import { Headers } from "node-fetch";
import { throws } from "assert";

export interface WikiJson {
  parse: {
    title: string;
    pageid: number;
    wikitext: {
      "*": string;
    };
  };
}

export interface WikiPage {
  title: string;
  pageid: number;
  wikitext: string;
  distilledtext: WikiSection;
}

export interface ApiResponse {
  statusCode: number;
  headers: Object;
  body: WikiPage;
}

export class WikiText {
  private body: string;

  static readonly regexpWikiTemplate: RegExp = /\{\{([^\{]*?)\}\}/;
  static readonly regexpWikiStyle: RegExp = /[\']{2,4}/;
  static readonly regexpWikiLink: RegExp = /[\[]{2}(.*?)[\]]{2}/

  static readonly regexpReferenceClosed: RegExp = /<ref([^<]*?)>.*?<\/ref>/;
  static readonly regexpReferenceSelfClosing: RegExp = /<ref([^<]*?)\/>/;

  constructor(text: string) {
    this.body = text;
  };

  public distill = (): void => {

  }

  public toString = (): string => {
    return this.body;
  }

  public has = (regexp: RegExp): boolean => {
    return regexp.test(this.body);
  }

  public remove = (regexp: RegExp): void => {
    this.body.replace(regexp, "");
  };

  public removeAll = (regexp: RegExp): void => {
    while (this.body.match(regexp)) {
      this.remove(regexp);
    }
  };

  // all classes that are extracted with this function
  // MUST have a group definition in their regexp
  public extract = (regexp: RegExp): string => {
    let item = this.body.match(regexp)![1];
    this.remove(new RegExp(this.body.match(regexp)![0]));
    return item;
  }

  public extractAll = (regexp: RegExp): Array<string> => {
    const items: Array<string> = [];

    while (this.has(regexp)) {
      let item = this.extract(regexp);
      items.push(item);

    };
    return items;
  };

  static extractDescription = (wikitext: WikiText, level: number): string => {
    console.log(`extracting description`);
    const regexpDescription = new RegExp(`^(.+?)={${level + 1}}`, "s");
    return wikitext.extract(regexpDescription);
  }

  static extractTemplates = (wikitext: WikiText): Array<string> => {
    console.log(`extracting templates`);
    return wikitext.extractAll(WikiText.regexpWikiTemplate);
  };

  static removeStyling = (wikitext: WikiText): void => {
    console.log(`removing styling`);
    wikitext.removeAll(WikiText.regexpWikiStyle);
  };

  static extractLinks = (wikitext: WikiText): Array<string> => {
    console.log(`extracting links`);
    return wikitext.extractAll(WikiText.regexpWikiLink);
  };

  static extractReferences = (wikitext: WikiText): Array<string> => {
    console.log(`extracting references`);
    const refClosed = wikitext.extractAll(WikiText.regexpReferenceClosed);
    const refSelfClosing = wikitext.extractAll(WikiText.regexpReferenceSelfClosing);
    return refClosed.concat(refSelfClosing);
  };

};

export class WikiSection {
  private wikitext: WikiText;
  private title?: string;
  private description: string;
  private level: number;
  private templates: Array<string>;
  private links: Array<string>;
  private references: Array<string>;
  private sections: Array<WikiSection>;

  private regexpDescription: RegExp; // text until sub-section

  constructor(text: string, level: number, title?: string) {
    this.wikitext = new WikiText(text);
    this.level = level;
    if (title) {
      this.title = title;
    }

    this.regexpDescription = new RegExp(`^(.+?)={${level + 1}}`, "s");
  }

  // used only for debuging
  public toString = (): string => {
    return this.wikitext.toString();
  }

  public distill = (): void => {
    if (!WikiSection.hasSubSection(this.wikitext, this.level)) {
      this.parse(this.wikitext);
    } else {
      console.log(`has sub-sections`);
      const descriptionWikiText = WikiText.extractDescription(this.wikitext, this.level)
      console.log(`[description WikiText] ${descriptionWikiText}`);
      //this.parse(new WikiText(descriptionWikiText));

      console.log(`finish parsing`);
      //this.sections = this.extractSubSections();

    }
  }

  private parse = (wikitext: WikiText): void => {
    console.log('start parsing');
    console.log(`[wikitext before template extraction] ${wikitext}`);
    this.templates = WikiText.extractTemplates(wikitext);
    console.log(`[templates] ${this.templates}`);
    console.log(`[wikitext after template extraction] ${wikitext}`);
    WikiText.removeStyling(wikitext);
    this.links = WikiText.extractLinks(wikitext);
    this.references = WikiText.extractReferences(wikitext);
    this.description = wikitext.toString();
    
  }

  // Checks
  static hasSubSection = (wikitext: WikiText, level: number): boolean => {
    const regexpSubSectionTitle = new RegExp(`=${level + 1}(.*?)=${level + 1}`);
    return wikitext.has(regexpSubSectionTitle);
  }

  // Getters / Extractors and Removers
  
  /*
    static extractSubSection = (wikitext: WikiText, level: number): any => {
      // get sub-section
      const title = WikiText.regex
      const section = new WikiSection(text, this.level+1, title);
      
      return true;
    }
  
    static extractSubSections = (): Array<WikiSection> => {
      const sections: Array<WikiSection>;
      while (this.wikitext.toString() != '') {
        let section = this.extractSubSection();
        if (this.hasSubSection()) {
          //
        }
      }
      return sections;
    }
  */


};


