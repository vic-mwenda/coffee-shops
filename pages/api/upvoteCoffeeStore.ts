import type { NextApiRequest, NextApiResponse } from 'next'
import { findRecordByFilter, updateRecord, getMinifiedRecords } from '../../lib/supabase'

const upvoteCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body

      if (id) {
        const records = await findRecordByFilter(id)

        if (records.length !== 0) {
          const record = records[0]

          const calculateVoting = parseInt(record.voting) + 1

          const updateRecords = await updateRecord(record.store_id, {
            voting: calculateVoting,
          })

          if (updateRecords) {
            const minifiedRecords = getMinifiedRecords(updateRecords)
            res.json(minifiedRecords)
          }
        } else {
          res.json({ message: "Coffee store id doesn't exist", id })
        }
      } else {
        res.status(400)
        res.json({ message: "Id is missing" })
      }
    } catch (error) {
      res.status(500)
      res.json({ message: "Error upvoting coffee store", error })
    }
  }
}

export default upvoteCoffeeStore
