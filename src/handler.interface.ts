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
  distilledtext: string;
}

export class WikiTemplate {
  static readonly regexp: RegExp = /\{\{([^\{]*?)\}\}/;
  private text: string;

  constructor(text: string) {
    this.text = text;
  }
}

export class WikiStyle {
  static readonly regexp: RegExp = /[\']{2,4}/;
}

export class Link {
  static readonly regexp: RegExp = /[\[]{2}(.*?)[\]]{2}/;
  readonly text: string;
  readonly url: string;

  constructor(text: string, url: string) {
    this.text = text;
    this.url = url;
  }

}

abstract class Reference {

}
export class ReferenceClosed extends Reference {
 static readonly regexp: RegExp = /<ref[^<](*?)>.*?<\/ref>/;
}

export class ReferenceSelfClosing extends Reference {
  static readonly regexp: RegExp = /<ref[^<](*?)\/>/;
}
 
export class WikiText {
  private body: string;

  constructor(text: string) {
    this.body = text;
  };

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
  public extractAll = (regexp: RegExp, items: Array<any>): Array<WikiTemplate> => {
    while (this.body.match(regexp)) {
      items.push(this.body.match(regexp)![1]);
      this.remove(new RegExp(this.body.match(regexp)![0]));
    };
    return items;
  };

  
};

export class WikiSection {
  private wikitext: WikiText;
  private templates: Array<WikiTemplate>;
  private links: Array<Link>;
  private references: Array<Reference>;

  constructor(text: string) {
    this.wikitext = new WikiText(text);
  }

  public extractTemplates = (): void => {
    this.wikitext.extractAll(WikiTemplate.regexp, this.templates);
  };

  public removeStyles = (): void => {
    this.wikitext.removeAll(WikiStyle.regexp);
  };

  public extractLinks = (): void => {
    this.wikitext.extractAll(Link.regexp, this.links);
  };

  public extractReferences = (): void => {
    this.wikitext.extractAll(ReferenceClosed.regexp, this.references);
    this.wikitext.extractAll(ReferenceSelfClosing.regexp, this.references);
  };

};
  

