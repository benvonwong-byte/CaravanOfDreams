// Venue facts and navigation shared by the header, footer, and pages.
export const SITE = {
  name: 'Caravan of Dreams',
  eventsEmail: 'events@caravanofdreams.net',
  address: {
    street: '405 E 6th Street',
    cityLine: 'New York, NY 10009',
    crossStreets: 'Between 1st Ave & Ave A',
  },
  // Event times are always shown in the venue's time zone, not the visitor's.
  timeZone: 'America/New_York',
}

export const NAV_LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/host', label: 'Host', longLabel: 'Host an Event' },
  { href: '/space', label: 'The Space' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
]
