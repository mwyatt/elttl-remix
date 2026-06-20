export function getMetaTitle (append) {
  return `${process.env.NEXT_PUBLIC_METADATA_TITLE}${append ? `: ${append}` : ''}`
}

export function getMetaDescription () {
  return '\'Welcome to the official website of the club. Here you can find all the latest news, fixtures, and results.\''
}

export const DeveloperEmail = 'martin.wyatt@gmail.com'
