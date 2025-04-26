import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const getMinifiedRecord = (record: any) => {
  return {
    recordId: record.id,
    ...record,
  }
}

const getMinifiedRecords = (records: any[]) => {
  return records.map((record) => getMinifiedRecord(record))
}

const findRecordByFilter = async (id: string) => {
  const { data, error } = await supabase
    .from('coffee-stores')
    .select('*')
    .eq('store_id', id)

  if (error) {
    console.error("Error finding record:", error)
    return []
  }

  return data ? getMinifiedRecords(data) : []
}

const updateRecord = async (recordId: string, fields: any) => {
  const { data, error } = await supabase
    .from('coffee-stores')
    .update(fields)
    .eq('store_id', recordId)
    .select()
  
  if (error) {
    console.error("Error updating record:", error)
    throw error
  }
  
  return data || []
}

const createRecord = async (fields: any) => {
  const { data, error } = await supabase
    .from('coffee-stores')
    .insert([fields])
    .select()
  
  if (error) {
    console.error("Error creating record:", error)
    throw error
  }
  
  return data || []
}

export { 
  supabase, 
  getMinifiedRecords, 
  findRecordByFilter, 
  updateRecord, 
  createRecord 
}
