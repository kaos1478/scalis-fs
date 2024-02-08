'use server'

interface IUserAccessData {
  userName: string
  password: string
}

export const fetchLogin = async (userData: IUserAccessData) => {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  return data
}
