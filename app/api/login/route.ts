import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

import { IUser, Transaction } from '../users/route'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json()

    if (!userName || !password) {
      return NextResponse.json(
        { error: 'invalid username or password.' },
        { status: 500 },
      )
    }

    const users: IUser = await prisma.user.findFirst({
      where: {
        userName,
        password,
      },
    })
    const transactions: Transaction[] = await prisma.transactions.findMany({
      where: {
        OR: [{ userId: users.id }, { destinationId: users.id }],
      },
    })

    return NextResponse.json({ ...users, transactions })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'fail in get users.' }, { status: 500 })
  }
}
