import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const getUserData = async () => {
  const userData = await fetch('http://localhost:3000/api/users?id=2')
  const parsedUserData = await userData.json()
  return parsedUserData
}

export default async function Home() {
  const user = await getUserData()

  if (!user) return

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="mr-3">
                New deposit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Deposit</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newCheckingBalance" className="text-right">
                    Checking Ammount
                  </Label>
                  <Input
                    id="newCheckingBalance"
                    value=""
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newSavingsBalance" className="text-right">
                    Savings Ammount
                  </Label>
                  <Input
                    id="newSavingsBalance"
                    value=""
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mr-3">
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Transaction</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="destinationId" className="text-right">
                    Destination ID
                  </Label>
                  <Input id="destinationId" value="" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkingBalance" className="text-right">
                    Checking Ammount
                  </Label>
                  <Input
                    id="checkingBalance"
                    value="0"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="savingsBalance" className="text-right">
                    Savings Ammount
                  </Label>
                  <Input id="savingsBalance" value="0" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="lign flex flex-col">
          <span className="text-right">
            Hi {user.name} ({user.id})
          </span>
          <span className="text-right">
            Checking Balance: {user.checkingBalance}
          </span>
          <span className="text-right">
            Saving Balance: {user.savingsBalance}
          </span>
        </div>
      </div>
      <div className="rounded-lg border p-2">
        <Table>
          <TableHeader>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Before Checking Balance</TableHead>
            <TableHead>Before Saving Balance</TableHead>
            <TableHead>After Checking Balance</TableHead>
            <TableHead>After Saving Balance</TableHead>
            <TableHead>Destination</TableHead>
          </TableHeader>
          <TableBody>
            {user.transactions?.map((transaction) => (
              <TableRow key={'table-' + transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.previousCheckingBalance}</TableCell>
                <TableCell>{transaction.previousSavingsBalance}</TableCell>
                <TableCell
                  className={
                    transaction.newCheckingBalance <
                    transaction.previousCheckingBalance
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  {transaction.newCheckingBalance}
                </TableCell>
                <TableCell
                  className={
                    transaction.newSavingsBalance <
                    transaction.previousSavingsBalance
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  {transaction.newSavingsBalance}
                </TableCell>
                <TableCell>{transaction.destinationId || user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
