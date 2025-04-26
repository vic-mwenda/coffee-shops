export type CoffeeResType = {
  id: string
  name: string
  location: {
    address: string
    neighborhood: string[]
    cross_street?: string
    postcode?: string
    country?: string
    formatted_address?: string
    locality?: string
    region?: string
  }
  geocodes: {
    lat?: number
    lng?: number
  }
  distance?: number
  imgUrl: string
  categories?: Array<{
    id: number
    name: string
    icon: {
      prefix: string
      suffix: string
    }
  }>
  link?: string
  timezone?: string
  // New fields we could add
  hours?: string
  rating?: number
  reviews?: any[]
  phone?: string
  website?: string
}

export type FoursquareResult = {
  fsq_id: string
  categories: Array<{
    id: number
    name: string
    icon: {
      prefix: string
      suffix: string
    }
  }>
  chains: any[]
  distance: number
  geocodes: {
    main: {
      latitude: number
      longitude: number
    }
    roof: {
      latitude: number
      longitude: number
    }
  }
  link: string
  location: {
    address: string
    country: string
    cross_street: string
    formatted_address: string
    locality: string
    neighborhood: string[]
    postcode: string
    region: string
  }
  name: string
  related_places: any
  timezone: string
  imgUrl?: string
}

export type supabaseReqBody = {
  store_id: string
  name: string
  voting: any
  address: string
  neighbourhood: string
  cross_street: string
  postcode: string
  lat: any
  lng: any
  distance: any
  imgUrl: string
}

export type AirtableRecord = {
  id: string
  fields: supabaseReqBody
}
