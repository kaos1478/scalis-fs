import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Transaction {
  id: number
  destinationId: number
  previousCheckingBalance: number
  newCheckingBalance: number
  previousSavingsBalance: number
  newSavingsBalance: number
  userId: number
}

export interface IUser {
  id: number
  name: string
  userName: string
  password: string
  checkingBalance: number
  savingsBalance: number
  transactions?: Transaction[]
}

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      checkingBalance = 0,
      savingsBalance = 0,
      userName,
      password,
    } = await req.json()

    if (!name || !userName || !password) {
      return NextResponse.json({ error: 'Param missing.' }, { status: 400 })
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        checkingBalance,
        savingsBalance,
        userName,
        password,
      },
    })

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create a new user.' },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const { senderUserId, destinationUserId, checkingBalance, savingsBalance } =
      await req.json()

    if (!senderUserId) {
      return NextResponse.json(
        { error: 'undefined sender ID.' },
        { status: 400 },
      )
    }

    // 1. Obter saldos atuais do remetente e destinatário
    const sender = await prisma.user.findUnique({
      where: { id: senderUserId },
    })

    const recipient = await prisma.user.findUnique({
      where: { id: destinationUserId },
    })

    if (!sender || !recipient) {
      return NextResponse.json(
        { error: 'Invalid sender or recipient ID.' },
        { status: 400 },
      )
    }

    // 2. Verificar se o remetente possui fundos suficientes
    if (
      sender.checkingBalance < checkingBalance ||
      sender.savingsBalance < savingsBalance
    ) {
      return NextResponse.json(
        { error: 'Insufficient funds.' },
        { status: 400 },
      )
    }

    // 3. Executar a transação
    const newSenderCheckingBalance = sender.checkingBalance - checkingBalance
    const newRecipientCheckingBalance =
      recipient.checkingBalance + checkingBalance
    const newSenderSavingsBalance = sender.savingsBalance - savingsBalance
    const newRecipientSavingsBalance =
      recipient.savingsBalance + checkingBalance

    // 4. Atualizar saldos na tabela User
    await prisma.user.update({
      where: { id: senderUserId },
      data: {
        checkingBalance: newSenderCheckingBalance,
        savingsBalance: newSenderSavingsBalance,
      },
    })

    await prisma.user.update({
      where: { id: destinationUserId },
      data: {
        checkingBalance: newRecipientCheckingBalance,
        savingsBalance: newRecipientSavingsBalance,
      },
    })

    // 5. Registrar a transação na tabela Transactions
    const senderTransaction = await prisma.transactions.create({
      data: {
        destinationId: destinationUserId,
        previousCheckingBalance: sender.checkingBalance,
        newCheckingBalance: newSenderCheckingBalance,
        previousSavingsBalance: sender.savingsBalance,
        newSavingsBalance: sender.savingsBalance,
        userId: senderUserId,
      },
    })

    const recipientTransaction = await prisma.transactions.create({
      data: {
        destinationId: senderUserId,
        previousCheckingBalance: recipient.checkingBalance,
        newCheckingBalance: newRecipientCheckingBalance,
        previousSavingsBalance: recipient.savingsBalance,
        newSavingsBalance: recipient.savingsBalance,
        userId: destinationUserId,
      },
    })

    return NextResponse.json({
      success: true,
      senderTransaction,
      recipientTransaction,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to process the transaction.' },
      { status: 500 },
    )
  }
}
