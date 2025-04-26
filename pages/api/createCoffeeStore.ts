import type { NextApiRequest, NextApiResponse } from 'next'
import { findRecordByFilter, createRecord, getMinifiedRecords } from '../../lib/supabase'
import { supabaseReqBody } from '../../interfaces'

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      store_id,
      name,
      address,
      neighbourhood,
      cross_street,
      postcode,
      lat,
      lng,
      distance,
      imgUrl,
      voting,
    } = req.body as supabaseReqBody

    try {
      if (store_id) {
        const records = await findRecordByFilter(store_id)

        if (records.length !== 0) {
          return res.json(records)
        } else {
          if (name) {
            const newRecord = {
              store_id: store_id.toString(),
              name,
              address,
              neighbourhood,
              cross_street,
              postcode,
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              distance: parseFloat(distance),
              imgUrl,
              voting: parseInt(voting) || 0,
            }
            
            const createdRecords = await createRecord(newRecord)
            const records = getMinifiedRecords(createdRecords)
            res.status(200).json(records)
          } else {
            res.status(400).json({
              msg: "Missing required field 'id' or 'name'. Try again.",
            })
          }
        }
      } else {
        res.status(400).json({ msg: "Missing required field 'id'. Try again." })
      }
    } catch (err) {
      console.error("Error creating or finding a store", err)
      res.status(500).json({ msg: "Error creating or finding a store", err })
    }
  }
}

export default createCoffeeStore
