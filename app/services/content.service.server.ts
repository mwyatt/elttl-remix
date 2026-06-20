import { getPressBySlugLike } from '~/repositories/content.repository.server'

export const getUniqueSlugFromTitle = async (db, id, title) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-')
  id = parseInt(id)

  const newsArticles = await getPressBySlugLike(db, slug)

  // No existing article with the same slug, we can use the slug as is
  if (newsArticles.length === 0) {
    return slug
  }

  // Article exists but we are updating the same article, so we can keep the slug so long as the title is the same
  const newsArticleSameId = newsArticles.find(article => article.id === id)
  if (newsArticleSameId && newsArticleSameId.title === title) {
    return newsArticleSameId.slug
  }

  // Article with the same slug exists, we need to find a unique slug by appending a number until we find a unique one
  let index = 2
  let uniqueSlug = `${slug}-${index}`

  while (newsArticles.some(article => article.slug === uniqueSlug)) {
    index++
    uniqueSlug = `${slug}-${index}`
  }

  return uniqueSlug
}
