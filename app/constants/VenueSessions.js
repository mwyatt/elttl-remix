export const sessionVenues = {
  5: { id: 5, name: 'Hyndburn Leisure Centre', slug: 'hyndburn-leisure-centre' },
  14: { id: 14, name: 'St Peter\'s Sports Centre', slug: 'st-peters-sports-centre' },
  15: { id: 15, name: 'Sion Church', slug: 'sion-church' },
  7: { id: 7, name: 'Whalley Village Hall', slug: 'whalley-village-hall' },
  6: { id: 6, name: 'Kay Street Baptist Church', slug: 'kay-street-baptist-church' }
}

export const sessionContacts = {
  405: { id: 405, name: 'Colin Hooper', slug: 'colin-hooper' },
  635: { id: 635, name: 'Mick Moir', slug: 'mick-moir' },
  468: { id: 468, name: 'David Heys', slug: 'david-heys' },
  66: { id: 66, name: 'Trevor Elkington', slug: 'trevor-elkington' },
  25: { id: 25, name: 'Fred Wade', slug: 'fred-wade' }
}

const sessionVenueIds = {
  hyndburn: 5,
  stpeters: 14,
  sionchurch: 15,
  whalleyvillagehall: 7,
  kayst: 6
}
const batAndChatMorning = {
  name: 'Bat and Chat 10:00 AM - 12:00 PM',
  cost: '£5',
  contactId: 468
}
const batAndChatStPeters = {
  ...batAndChatMorning,
  contactId: 25
}
const hyndburnPracticeEvening = {
  name: 'Practice 7:00 PM - 10:00 PM',
  cost: '£5'
}
const stpetersPracticeEvening = {
  name: 'Practice 7:00 PM - 10:00 PM',
  cost: '£5',
  contactId: 25
}

export const sessions = {
  1: {
    [sessionVenueIds.hyndburn]: [batAndChatMorning, hyndburnPracticeEvening],
    [sessionVenueIds.kayst]: [
      {
        name: 'Practice 7.30 PM - 10.00 PM',
        contactId: 66
      }
    ]
  },
  2: {
    [sessionVenueIds.hyndburn]: [hyndburnPracticeEvening]
  },
  3: {
    [sessionVenueIds.stpeters]: [batAndChatStPeters],
    [sessionVenueIds.hyndburn]: [hyndburnPracticeEvening],
    [sessionVenueIds.whalleyvillagehall]: [
      {
        name: 'Practice 7.30 PM - 10.00 PM (Only open outside of the season from April to early September)',
        contactId: 405
      }
    ]
  },
  4: {
    [sessionVenueIds.hyndburn]: [batAndChatMorning, hyndburnPracticeEvening],
    [sessionVenueIds.stpeters]: [stpetersPracticeEvening]
  },
  5: {
    [sessionVenueIds.hyndburn]: [
      {
        name: 'Junior Coaching (Primary age) 6:00 PM - 7:00 PM',
        cost: '£5',
        contactId: 635
      },
      {
        name: 'Junior Coaching (Secondary age) 7:00 PM - 8:00 PM',
        cost: '£5',
        contactId: 635
      }
    ]
  },
  6: {
    [sessionVenueIds.hyndburn]: [
      {
        name: 'Practice 10:00 AM - 12:00 PM',
        cost: '£5'
      }
    ],
    [sessionVenueIds.whalleyvillagehall]: [
      {
        name: 'Practice 9.30 AM - 12.00 PM (Most Saturdays)',
        cost: '£5',
        contactId: 405
      }
    ]
  }
}

export const getDayVenueSessions = (date) => {
  const today = date.day()
  return sessions[today] || {}
}
