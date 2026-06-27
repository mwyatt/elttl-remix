export const getShortPlayerName = (name) => {
  if (name === undefined || name === null || name.trim() === '') {
    name = 'Unknown Player'
  }

  const [firstName, lastName] = name.split(' ')
  return `${firstName.charAt(0).toUpperCase()}. ${lastName}`
}
