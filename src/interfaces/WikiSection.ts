import { WikiText } from "./WikiText";

export interface IDistilledWikiText {
  description: string;
  title?: string;
  sections: IDistilledWikiText[];
}


export class WikiSection {
  public title?: string;
  public description: string;
  public sections: WikiSection[];
  private wikitext: WikiText;
  private level: number;
  private templates: string[];
  private links: string[];
  private references: string[];

  private regexpDescription: RegExp; // text until sub-section

  constructor(text: string, level: number, title?: string) {
    this.wikitext = new WikiText(text);
    this.level = level;
    if (title) {
      this.title = title;
    }
    this.sections = [];
  }

  // Checks
  public static hasSection = (wikitext: WikiText, level: number): boolean => {
    const regexpSectionTitle = new RegExp(`={${level}}([^=]*?)={${level}}`);
    return wikitext.has(regexpSectionTitle);
  };

  /**
   * Data Manipulation
   */
  public distill = (): void => {
    if (!WikiSection.hasSection(this.wikitext, this.level + 1)) {
      this.parse(this.wikitext);
    } else {
      const sectionDescriptionWikiText = WikiText.extractDescription(
        this.wikitext,
        this.level
      );
      this.parse(new WikiText(sectionDescriptionWikiText));

      this.sections = WikiSection.extractSections(this.wikitext, this.level);
    }
  };

  private parse = (wikitext: WikiText): void => {
    this.templates = WikiText.extractTemplates(wikitext);
    WikiText.removeStyling(wikitext);
    this.links = WikiText.extractLinks(wikitext);
    this.references = WikiText.extractReferences(wikitext);
    WikiText.removeNewLines(wikitext);
    this.description = wikitext.toString();
  };

  public static extractSection = (
    wikitext: WikiText,
    level: number
  ): WikiSection => {
    const regexpSectionTitle = new RegExp(`={${level}}([^=]*?)={${level}}`);
    const regexpTextUntilSection = new RegExp(`^(.+?)={${level}}`, "s");

    const sectionTitle = wikitext.extract(regexpSectionTitle).trim();
    let sectionBody;

    if (regexpTextUntilSection.test(wikitext.toString())) {
      sectionBody = wikitext.extract(regexpTextUntilSection, "=".repeat(level));
    } else {
      sectionBody = wikitext.toString();
    }

    const section = new WikiSection(sectionBody, level + 1, sectionTitle);
    section.distill();
    return section;
  };

  public static extractSections = (
    wikitext: WikiText,
    level: number
  ): WikiSection[] => {
    const sections: WikiSection[] = [];
    while (wikitext.toString() != "") {
      if (WikiSection.hasSection(wikitext, level + 1)) {
        const section = WikiSection.extractSection(wikitext, level + 1);
        sections.push(section);
      } else {
        wikitext.empty();
      }
    }
    return sections;
  };

  /**
   * Output Formatting
   */
  public toString = (): string => {
    return this.wikitext.toString();
  };

  public show = (): IDistilledWikiText => {
    if (this.title) {
      return {
        title: this.title,
        description: this.description,
        sections: this.showSections()
      };
    } else {
      return {
        description: this.description,
        sections: this.showSections()
      };
    }
  };

  public showSections = (): IDistilledWikiText[] => {
    const formatedSections: IDistilledWikiText[] = [];

    this.sections.forEach(section => {
      if (section.title) {
        formatedSections.push({
          title: section.title,
          description: section.description,
          sections: section.showSections()
        });
      } else {
        formatedSections.push({
          description: section.description,
          sections: section.showSections()
        });
      }
    });
    return formatedSections;
  };
}
