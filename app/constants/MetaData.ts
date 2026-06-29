export const BrandName = 'East Lancashire Table Tennis League'

export function getMetaTitle (append?: string) {
  return `${BrandName}${append ? `: ${append}` : ''}`
}

export function getMetaDescription () {
  return '\'Welcome to the official website of the club. Here you can find all the latest news, fixtures, and results.\''
}

export const DeveloperEmail = 'martin.wyatt@gmail.com'

export function buildMeta({
  title,
  description,
  suffix = BrandName,
  image = "/social-card.png",
}: {
  title?: string;
  description?: string;
  suffix?: string;
  image?: string;
}) {
  const fullTitle = title ? `${title} – ${suffix}` : suffix;

  return [
    { title: fullTitle },
    description && { name: "description", content: description },

    // Open Graph
    { property: "og:title", content: fullTitle },
    description && { property: "og:description", content: description },
    { property: "og:image", content: image },
  ].filter(Boolean);
}
