'use client'

type TKey = string
type TValue = string | number

export const setLocalStorage = (key: TKey, value: TValue) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorage = (key: TKey) => {
  const data = window.localStorage.getItem(key)
  return data
}

export const removeLocalStorage = (key: TKey) => {
  window.localStorage.removeItem(key)
}

export const getUserDataLocalStorage = () => {
  const data = window.localStorage.getItem('userData')
  if (data) return JSON.parse(data)
}

export const updateUserDataLocalStorage = (key: TKey, value: TValue) => {
  const data = getUserDataLocalStorage()
  if (data) {
    const newData = { ...data, [key]: value }
    setLocalStorage('userData', newData)
  }
}
