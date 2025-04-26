import { fetchCoffeePhotos } from "./fetchCoffeePhotos"
import type { CoffeeResType, FoursquareResult } from "../interfaces"

type Query = {
  query: string
  LatLong: string
  limit: string
}

const getUrlForCoffeeStores = (query: Query) => {
  const url = `https://api.foursquare.com/v3/places/search?query=${
    query.query
  }&ll=${query.LatLong}&sort=DISTANCE&limit=${query.limit.toString()}`
  return url
}

export const fetchCoffeeStores = async (
  LatLong = "-1.286389,36.817223",
  limit = "6"
): Promise<CoffeeResType[]> => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY}`,
    },
  }
  
  const response = await fetch(
    getUrlForCoffeeStores({
      query: "coffee",
      LatLong: LatLong,
      limit: limit,
    }),
    options
  )
  const data = await response.json()

  const photos = await fetchCoffeePhotos()

  return data.results.map((result: FoursquareResult, index: number) => {
    return {
      id: result.fsq_id,
      name: result.name,
      location: {
        address: result.location?.address ?? "",
        neighborhood: result.location?.neighborhood ?? [""],
        cross_street: result.location?.cross_street ?? "",
        postcode: result.location?.postcode ?? "",
        country: result.location?.country ?? "",
        formatted_address: result.location?.formatted_address ?? "",
        locality: result.location?.locality ?? "",
        region: result.location?.region ?? "",
      },
      geocodes: {
        lat: result.geocodes.main.latitude,
        lng: result.geocodes.main.longitude,
      },
      distance: result.distance,
      imgUrl: photos[index],
      categories: result.categories || [],
      link: result.link || "",
      timezone: result.timezone || "",
    }
  })
}
