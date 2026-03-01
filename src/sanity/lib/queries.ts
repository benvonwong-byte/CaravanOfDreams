import { defineQuery } from 'next-sanity'

export const UPCOMING_EVENTS_QUERY = defineQuery(
  `*[_type == "event" && status == "approved" && date >= now()] | order(date asc)[0...4]{
    _id,
    title,
    slug,
    date,
    hostName,
    category,
    featuredImage
  }`
)

export const ALL_EVENTS_QUERY = defineQuery(
  `*[_type == "event" && status == "approved"] | order(date desc){
    _id,
    title,
    slug,
    date,
    endDate,
    hostName,
    category,
    featuredImage
  }`
)

export const EVENT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "event" && slug.current == $slug && status == "approved"][0]{
    _id,
    title,
    slug,
    description,
    date,
    endDate,
    hostName,
    hostBio,
    category,
    featuredImage
  }`
)

export const MENU_ITEMS_QUERY = defineQuery(
  `*[_type == "menuItem"] | order(category asc, name asc){
    _id,
    name,
    description,
    price,
    category,
    dietaryTags,
    image
  }`
)

export const PAGE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    content
  }`
)

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{
    tagline,
    mission,
    address,
    hours,
    socialLinks,
    contactEmail
  }`
)
