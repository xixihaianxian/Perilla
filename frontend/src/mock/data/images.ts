/**
 * Curated placeholder image URLs for notes
 * Categories: fashion, food, travel, nature, architecture, art, lifestyle, tech, pets
 */

const FASHION = [
  'https://picsum.photos/seed/fashion1/640/800',
  'https://picsum.photos/seed/fashion2/640/960',
  'https://picsum.photos/seed/fashion3/640/640',
  'https://picsum.photos/seed/fashion4/640/800',
  'https://picsum.photos/seed/fashion5/640/960',
  'https://picsum.photos/seed/fashion6/640/480',
  'https://picsum.photos/seed/fashion7/640/800',
  'https://picsum.photos/seed/fashion8/640/640',
]

const FOOD = [
  'https://picsum.photos/seed/food1/640/640',
  'https://picsum.photos/seed/food2/640/800',
  'https://picsum.photos/seed/food3/640/640',
  'https://picsum.photos/seed/food4/640/960',
  'https://picsum.photos/seed/food5/640/640',
  'https://picsum.photos/seed/food6/640/800',
  'https://picsum.photos/seed/food7/640/640',
  'https://picsum.photos/seed/food8/640/480',
]

const TRAVEL = [
  'https://picsum.photos/seed/travel1/640/480',
  'https://picsum.photos/seed/travel2/640/640',
  'https://picsum.photos/seed/travel3/640/800',
  'https://picsum.photos/seed/travel4/640/480',
  'https://picsum.photos/seed/travel5/640/640',
  'https://picsum.photos/seed/travel6/640/960',
  'https://picsum.photos/seed/travel7/640/480',
  'https://picsum.photos/seed/travel8/640/800',
]

const NATURE = [
  'https://picsum.photos/seed/nature1/640/480',
  'https://picsum.photos/seed/nature2/640/800',
  'https://picsum.photos/seed/nature3/640/640',
  'https://picsum.photos/seed/nature4/640/480',
  'https://picsum.photos/seed/nature5/640/960',
  'https://picsum.photos/seed/nature6/640/640',
  'https://picsum.photos/seed/nature7/640/480',
  'https://picsum.photos/seed/nature8/640/800',
]

const ART = [
  'https://picsum.photos/seed/art1/640/800',
  'https://picsum.photos/seed/art2/640/640',
  'https://picsum.photos/seed/art3/640/960',
  'https://picsum.photos/seed/art4/640/640',
  'https://picsum.photos/seed/art5/640/800',
  'https://picsum.photos/seed/art6/640/480',
  'https://picsum.photos/seed/art7/640/640',
  'https://picsum.photos/seed/art8/640/960',
]

const LIFESTYLE = [
  'https://picsum.photos/seed/life1/640/640',
  'https://picsum.photos/seed/life2/640/800',
  'https://picsum.photos/seed/life3/640/960',
  'https://picsum.photos/seed/life4/640/640',
  'https://picsum.photos/seed/life5/640/800',
  'https://picsum.photos/seed/life6/640/480',
  'https://picsum.photos/seed/life7/640/640',
  'https://picsum.photos/seed/life8/640/960',
]

const PETS = [
  'https://picsum.photos/seed/pet1/640/640',
  'https://picsum.photos/seed/pet2/640/800',
  'https://picsum.photos/seed/pet3/640/640',
  'https://picsum.photos/seed/pet4/640/960',
  'https://picsum.photos/seed/pet5/640/640',
  'https://picsum.photos/seed/pet6/640/800',
  'https://picsum.photos/seed/pet7/640/480',
  'https://picsum.photos/seed/pet8/640/640',
]

export const categoryImages: Record<string, string[]> = {
  fashion: FASHION,
  food: FOOD,
  travel: TRAVEL,
  nature: NATURE,
  art: ART,
  lifestyle: LIFESTYLE,
  pets: PETS,
}

export const allImages: string[] = Object.values(categoryImages).flat()
