export const setStorage = (storage: Storage, key: string, value: any) => {
  if (value === undefined || value === null) return
  storage.setItem(key, JSON.stringify(value))
}

export const getStorage = (storage: Storage, key: string): any => {
  let value = storage.getItem(key)
  if (!value) return null
  return JSON.parse(value)
}
