# Coffee Shops with Next.js, SWR, and Supabase

Just completed a project using Next.js, and wow, what a powerful framework! Not only did it allow for blazingly fast performance with the use of both SSG and SSR, but also made it easy to work with TypeScript, create API routes and leverage Supabase for database functionality. Despite the simple appearance of the site, there was a lot of work happening behind the scenes to ensure a smooth user experience. The out-of-the-box features of Next.js truly make it a full-stack framework. Excited to continue utilizing its capabilities in future projects.

This project served as a learning tool for me to get more familiar with the advanced features of Next.js and to explore Supabase as a modern database solution. I also wanted to learn more about the use of SWR to handle data fetching and caching, as well as creating API routes to interact with the database.

The site isn't necessarily a finished product, I'm not in love with the styling, but that was not the point of this project. Even though the site appears very rudimentary, there is a lot of work happening behind the scenes to ensure a smooth user experience. The out-of-the-box features of Next.js truly make it a full-stack framework. Excited to continue utilizing its capabilities in future projects.

## Demo

[Live Demo](https://coffee-shops-31ao55ptj-vic-mwendas-projects.vercel.app) - Browse coffee shops, view details, and vote for your favorites.

## Tools Used

- [Next.js](https://nextjs.org/) (framework)
- [SWR](https://swr.vercel.app/) (data fetching)
- [Supabase](https://supabase.com/) (database)
- [Foursquare API](https://developer.foursquare.com/) (API for coffee shop data)
- [Unsplash API](https://unsplash.com/developers) (API for coffee shop images)

## Getting Started

If you do plan on cloning this repo, you will need to create a `.env.local` file in the root directory and add the following:

```bash
NEXT_PUBLIC_FOURSQUARE_API_KEY=<your key here>
NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
SUPABASE_SERVICE_KEY=<your supabase service key>
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=<your key here>
```

## Features

- Optimized [fonts](https://nextjs.org/docs/api-reference/next/font) with `@next/fonts`.
- [SEO](https://nextjs.org/docs/api-reference/next/head) using `Head` component from `next/head`.
- [Static Site Generation](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) with `getStaticProps` and `getStaticPaths`.
- [useRouter](https://nextjs.org/docs/api-reference/next/router#userouter) to get the `id` of the coffee shop from the URL.
- [context](https://nextjs.org/docs/basic-features/data-fetching#the-context-object) to store the coffee shop data.
- [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) to handle the state of the vote count.
- [API Routes](https://nextjs.org/docs/api-routes/introduction) to handle the vote count, and to create a new record in Supabase if the coffee shop is not found in the database.

## Packages and Tools

### Classnames

- [classnames](https://www.npmjs.com/package/classnames) is used to conditionally join class names together.
- used to conditionally join the `.glass` style to the card component.

### Glassmorphism

- [Glassmorphism](https://hype4.academy/tools/glassmorphism-generator) is a design trend that uses frosted glass effect in the UI.

### Foursquare API

- [Foursquare API](https://developer.foursquare.com/) is used to get the coffee shops data. Free API that requires an account to use. Has a limit of 50 queries per second.

### Supabase
  
I used Supabase as the database solution for this project. It handles situations where somebody visits a coffee shop page (e.g., "http://localhost:3000/coffee-store/4aae9450f964a5207e6220e3") which is **not** statically generated and is **not** stored in context (client side rendering). This would occur if someone shared a link to a store near them. In summary, if a store is not found in SSG, then use context. If context is empty, use Supabase.

Supabase provided a seamless developer experience with its PostgreSQL database and intuitive JavaScript client. The ability to easily query, filter, and update records made it perfect for this application. The Supabase client library's clean API allowed for straightforward implementation of database operations with minimal boilerplate code.
  
#### createCoffeeStore

This API route is used to return a store if it exists **or** create a new record if it is not found. This was done by checking the request method used and destructuring the request query. I then checked if the store `id` existed in the database to determine if it was a new record.

The implementation with Supabase was straightforward, using methods like `.select()`, `.eq()`, `.insert()`, and `.update()` to handle the database operations in a clean and readable way.

### SWR

[SWR](https://swr.vercel.app/) (`stale-while-revalidate`) is a hook library created by the team at Vercel. SWR was used to update the vote count for a given coffee shop. SWR is a React hook library for remote data fetching. It is similar to React Query, but it is more lightweight.

## Serverless Function with Next.js

API routes are built into Next.js by using an `api` folder within the `pages` directory. The API routes are serverless functions that are deployed as AWS Lambda functions. Learn more about API routes with Next.js [here](https://nextjs.org/docs/api-routes/introduction).

I decided to create an API to handle votes for a given coffee store. I used Supabase to create my own RESTful API.

I also learnt about creating [catch all](https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes) routes with `[...slug]`. This is useful when you want to create a dynamic route that can handle multiple parameters. I used this to create a dynamic route for the coffee shop page.

I also create an API to query coffee stores. This allowed me to make requests to "/api/getCoffeeStoresByLocation?latLong=34,-118&limit=30" to get coffee stores near a given location. I used this API to get coffee stores near the user's location and limit the number of coffee stores to 30. This wasn't necessary to do, but I wanted to learn how to create an API to query data. 

> Side note: Do not call API routes when using SSG (i.e., when using `getStaticProps` or `getStaticPaths`). Instead, write the server-side code directly in `getStaticProps` or `getStaticPaths`. API routes are only meant to be used for API routes. If you call an API route, SSG may fail at build time because the API routes do not exist. Read more [here](https://nextjs.org/docs/basic-features/data-fetching/get-static-props#write-server-side-code-directly).

```tsx
// * only runs at build time on the server, NOT client side
export async function getStaticProps() {
  // Good!
  const coffeeStoresData = await fetchCoffeeStores()

  // DO NOT DO THIS !! BAD!
  // const coffeeStoresData = await fetch(
  //   `api/getCoffeeStoresByLocation?latLong=42,123&limit=6`
  // ).then((res) => res.json())

  return {
    props: {
      coffeeStores: coffeeStoresData,
    },
  }
}
```

## Takeaways

- Using `getStaticProps` to run server side code at build time. Used this function to fetch the coffee shop data from the API, and then pass it to the `Card` component as props. This allows for better performance because the data is fetched at build time and is up to date, as well as security because the data is not exposed to the client.
- Using `getStaticPaths` to generate the paths for the coffee shop pages.
  - These pages required the use of the `getStaticProps`, but I didn't have access to the `useRouter` object. In the dynamic paths I needed to get the `id` of the coffee shop from the `params` object. I used the `id` to fetch the coffee shop data from the API. I learnt that I could use the `params` object to get the `id` of the coffee shop.
    - I filtered the coffee shops to get the coffee shop with the matching `id`. I used the `find` method to get the coffee shop with the matching `id`. Did this on the server side because I didn't want to expose the data to the client.
  - Learnt about the `fallback` property. This property is used to determine what to do when a page is requested that is not generated at build time. The options are `true` or `false`. If `true`, the page will be generated at request time. This is more useful when you have a ton of static pages. If `false`, the page will return a 404 error. I used `false` because I wanted to return a 404 error if the page is not found.
- Custom hook to handle getting the user geolocation.

Making the dynamic store was tricky. I wanted to prerender the static pages, but also wanted to use the route to handle pages generated from a fetch request. The fetch request pages would be generated if a user requests to use their location to get nearby stores. 

I needed to tell the dynamic route to use static props if the user is not using their location, and use the `StoreContext` if the user is using their location. I set the `fallback` to `true` and used the `useRouter` hook to get the `query` object. I used the `query` object to check if the user is using their location. If the user is using their location, I used the `StoreContext` to get the store data. 

In all, if the `id` provided by the router object does not match the statically generated paths, then find the matching `id` in the `StoreContext` and return the store data. If the `id` does not match the `StoreContext`, then return a 404 error.
