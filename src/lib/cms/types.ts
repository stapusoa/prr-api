export type Property = {
  _id: string
  title: string
  description?: string
  address?: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  dateAdded?: string
  type?: string[]
  features?: string[]
  imageUrl?: string
}

export type Page = {
  _id: string;
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  robots?: string;

  hero?: {
    title?: string;
    titleAlignment?: "left" | "center";
    subheader?: string;
    subheaderAlignment?: "left" | "center";
    ctaText?: string;
    ctaLink?: string;
    heroImageSM?: { asset: { url: string } };
    heroImageMD?: { asset: { url: string } };
    heroImageLG?: { asset: { url: string } };
  };

  content?: Array<
    | {
        _type: "textBlock";
        heading?: string;
        headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
        headingAlignment?: "left" | "center";
        body?: any[];
        textAlignment?: "left" | "center";
      }
    | {
        _type: "imageBlock";
        alt?: string;
        alignment?: "left" | "center" | "right";
        asset: { url: string };
      }
  >;
};