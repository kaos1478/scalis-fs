-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "checkingBalance" REAL NOT NULL,
    "savingsBalance" REAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destinationId" INTEGER NOT NULL,
    "previousCheckingBalance" REAL NOT NULL,
    "newCheckingBalance" REAL NOT NULL,
    "previousSavingsBalance" REAL NOT NULL,
    "newSavingsBalance" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
