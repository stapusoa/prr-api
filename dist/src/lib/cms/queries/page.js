export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  metaDescription,
  canonicalUrl,
  robots,
  hero {
    title,
    titleAlignment,
    subheader,
    subheaderAlignment,
    ctaText,
    ctaLink,
    heroImageSM { asset->{url} },
    heroImageMD { asset->{url} },
    heroImageLG { asset->{url} }
  },
  content[]{
    _type,
    ...,
    heading,
    headingLevel,
    headingAlignment,
    body,
    textAlignment,
    alt,
    alignment,
    asset->{url}
  }
}`;
