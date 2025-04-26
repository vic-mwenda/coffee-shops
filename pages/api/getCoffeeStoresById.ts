import type { NextApiRequest, NextApiResponse } from 'next'
import { findRecordByFilter } from '../../lib/supabase'

const getCoffeeStoresById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.query as { id: string }
  try {
    const coffeeStore = await findRecordByFilter(id)

    if (coffeeStore.length !== 0) {
      return res.json(coffeeStore)
    } else {
      return res
        .status(404)
        .json({ message: `Record not found with id: ${id}` })
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" })
  }
}

export default getCoffeeStoresById
