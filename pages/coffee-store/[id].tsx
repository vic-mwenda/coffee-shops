import Link from "next/link"
import Image from "next/image"
import Head from "next/head"
import clx from "classnames"
import { useRouter } from "next/router"
import useSWR from "swr"
import {
  BiMap,
  BiCurrentLocation,
  BiStar,
  BiArrowBack,
  BiLoader,
} from "react-icons/bi"
import { fetchCoffeeStores } from "../../lib/fetchCoffeeStores"
import styles from "../../styles/coffee-store.module.css"
import type { CoffeeResType, supabaseReqBody } from "../../interfaces"
import { useEffect, useState, useContext } from "react"
import { StoreContext } from "../../context/store-context"

type InitialPropsType = {
  coffeeStore: CoffeeResType
} | null

const CoffeeStore = (initialProps: InitialPropsType) => {
  const router = useRouter()
  const id = router.query.id
  const { state } = useContext(StoreContext)

  const [votingCount, setVotingCount] = useState<number>(0)

  const [store, setStore] = useState<CoffeeResType | null>(
    initialProps?.coffeeStore || null
  )

  const handleCreateCoffeeStore = async (coffeeStore: CoffeeResType) => {
    try {
      const {
        id,
        name,
        location: { address, neighborhood, cross_street, postcode },
        geocodes: { lat, lng },
        distance,
        imgUrl,
      } = coffeeStore

      const res = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          store_id: id,
          name,
          voting: 0,
          address: address || "",
          neighbourhood: neighborhood[0],
          cross_street: cross_street || "",
          postcode: postcode || "",
          lat: lat || 0,
          lng: lng || 0,
          distance: distance || 0,
          imgUrl: imgUrl || "",
        } as supabaseReqBody),
      })

      await res.json()
    } catch (error) {
      console.error("Error creating coffee store", error)
    }
  }

  useEffect(() => {
    if (initialProps?.coffeeStore === null) {
      const getStore = state.coffeeStores?.find(
        (store) => store.id === id
      ) as CoffeeResType

      setStore(getStore)
      handleCreateCoffeeStore(getStore)
    } else {
      handleCreateCoffeeStore(initialProps?.coffeeStore as CoffeeResType)
    }
  }, [initialProps, id, state.coffeeStores, initialProps?.coffeeStore])

  const handleUpvoteClick = async () => {
    try {
      const response = await fetch("/api/upvoteCoffeeStore", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      })

      const dbCoffeeStore = await response.json()

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1
        setVotingCount(count)
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err)
    }
  }

  const fetcher = (url: string) => fetch(url).then((res) => res.json())

  const { data, error, isLoading } = useSWR(
    `/api/getCoffeeStoresById?id=${id}`,
    fetcher
  ) as {
    data: supabaseReqBody[]
    error: any
    isLoading: boolean
  }

  useEffect(() => {
    if (data && data.length > 0) {
      setVotingCount(data[0].voting)
    }
  }, [data])

  if (!store) return <div>Loading...</div>

  const vote = isLoading ? (
    <BiLoader />
  ) : error ? (
    "Error fetching voting count"
  ) : (
    votingCount
  )

  return (
    <>
      <Head>
        <title>{store.name}</title>
        <meta name="description" content={`Coffee Critic - ${store.name}`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link
              href="/"
              scroll={false}
              className={styles.backToHomeContainer}
            >
              <BiArrowBack className={styles.backToHomeArrow} />
              Back to home
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{store.name}</h1>
          </div>
          <Image
            src={store.imgUrl}
            alt={store.name}
            width={500}
            height={500}
            className={styles.storeImg}
          />
        </div>
        <div className={clx("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <BiMap className={styles.icon} />
            <p className={styles.text}>
              {store.location.address} {store.location.postcode}
            </p>
          </div>
          <div className={styles.iconWrapper}>
            <BiCurrentLocation className={styles.icon} />
            <p className={styles.text}>{store.location.neighborhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <BiStar className={styles.icon} />
            <p className={styles.text}>{vote}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteClick}>
            Upvote
          </button>
        </div>
      </div>
    </>
  )
}
export default CoffeeStore

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { id } = params

  const coffeeStoresData = await fetchCoffeeStores()

  const findCoffeeStoreById =
    coffeeStoresData.find(
      (coffeeStore: CoffeeResType) => coffeeStore.id === id
    ) || null

  return {
    props: {
      coffeeStore: findCoffeeStoreById,
    },
  }
}

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeeStores()

  const paths = coffeeStoresData.map((coffeeStore: CoffeeResType) => {
    return {
      params: {
        id: coffeeStore.id,
      },
    }
  })
  return {
    paths,
    fallback: true,
  }
}
