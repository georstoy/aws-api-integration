export class WikiText {

    public static readonly regexpWikiTemplate: RegExp = /\{\{([^\{]*?)\}\}/;
    public static readonly regexpWikiStyle: RegExp = /[\']{2,4}/;
  
    public static readonly regexpNewLines: RegExp = /\n/;
    public static readonly regexpWikiLink: RegExp = /[\[]{2}(.*?)[\]]{2}/;
  
    public static readonly regexpReferenceClosed: RegExp = /<ref([^<]*?)>.*?<\/ref>/;
    public static readonly regexpReferenceSelfClosing: RegExp = /<ref([^<]*?)\/>/;
  
    public static extractDescription = (wikitext: WikiText, level: number): string => {
      // console.log(`extracting description`);
      const regexpDescription = new RegExp(`^(.+?)={${level + 1}}`, "s");
      return wikitext.extract(regexpDescription, "=".repeat(level + 1));
    }
  
    public static extractTemplates = (wikitext: WikiText): string[] => {
      // console.log(`extracting templates`);
      return wikitext.extractAll(WikiText.regexpWikiTemplate);
    }
  
    public static removeStyling = (wikitext: WikiText): void => {
      // console.log(`removing styling`);
      wikitext.removeAll(WikiText.regexpWikiStyle);
    }
  
    public static removeNewLines = (wikitext: WikiText): void => {
      // console.log(`removing new lines`);
      wikitext.removeAll(WikiText.regexpNewLines);
    }
  
    public static extractLinks = (wikitext: WikiText): string[] => {
      // console.log(`extracting links`);
      return wikitext.extractAll(WikiText.regexpWikiLink);
    }
  
    public static extractReferences = (wikitext: WikiText): string[] => {
      // console.log(`extracting references`);
      const refClosed = wikitext.extractAll(WikiText.regexpReferenceClosed);
      const refSelfClosing = wikitext.extractAll(
        WikiText.regexpReferenceSelfClosing,
      );
      return refClosed.concat(refSelfClosing);
    }
    private body: string;
  
    constructor(text: string) {
      this.body = text;
    }
  
    public toString = (): string => {
      return this.body;
    }
  
    public empty = (): void => {
      this.body = "";
    }
  
    public has = (regexp: RegExp): boolean => {
      return regexp.test(this.body);
    }
  
    public remove = (segment: RegExp | string, replaceStr?: string): void => {
      const body = this.body;
      if (replaceStr) {
        this.body = this.body.replace(segment, replaceStr);
      } else {
        this.body = this.body.replace(segment, "");
      }
  
    }
  
    public removeAll = (regexp: RegExp): void => {
      while (this.body.match(regexp)) {
        this.remove(regexp);
      }
    }
  
    // all classes that are extracted with this function
    // MUST have a group definition in their regexp
    public extract = (regexp: RegExp, replaceStr?: string): string => {
      const item = this.body.match(regexp)![1];
      if (replaceStr) {
        this.remove(this.body.match(regexp)![0], replaceStr);
      } else {
        this.remove(this.body.match(regexp)![0]);
      }
  
      return item;
    }
  
    public extractAll = (regexp: RegExp): string[] => {
      const items: string[] = [];
  
      while (this.has(regexp)) {
        const item = this.extract(regexp);
        items.push(item);
      }
      return items;
    }
  }