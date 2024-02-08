'use client'

type TKey = string
type TValue = string

export const setLocalStorage = (key: TKey, value: TValue) => {
  window.localStorage.setItem(key, value)
}

export const getLocalStorage = (key: TKey) => {
  const data = window.localStorage.getItem(key)
  return data
}

export const removeLocalStorage = (key: TKey) => {
  window.localStorage.removeItem(key)
}
