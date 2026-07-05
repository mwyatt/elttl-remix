export const getShortPlayerName = (name) => {
  if (name === undefined || name === null || name.trim() === '') {
    name = 'Unknown Player'
  }

  const [firstName, lastName] = name.split(' ')
  return `${firstName.charAt(0).toUpperCase()}. ${lastName}`
}

export const getPlayerBySlug = (slug, players) => {
    return players.find((player) => player.slug === slug)
  }
