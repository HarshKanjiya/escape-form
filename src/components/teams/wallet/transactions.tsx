"use client"

import { CreditIcon } from "@/components/shared/creditIcon"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, ArrowDownLeft, Send } from "lucide-react"

interface Transactions {
    filter?: "all" | "received" | "sent" | "usage"
}

interface ITransaction {
    id: number
    type: string
    title: string
    description: string
    amount: number
    date: string
    icon: typeof ArrowUpRight | typeof ArrowDownLeft | typeof Send
}

const transactions: ITransaction[] = [
    {
        id: 1,
        type: "credit-purchase",
        title: "Credits Purchase",
        description: "Bought 500 credits",
        amount: -500,
        date: "Nov 5, 2:30 PM",
        icon: ArrowUpRight,
    },
    {
        id: 2,
        type: "transfer-received",
        title: "Transfer Received",
        description: "From Sarah Johnson",
        amount: 150,
        date: "Nov 4, 1:15 PM",
        icon: ArrowDownLeft,
    },
    {
        id: 3,
        type: "transfer-sent",
        title: "Transfer Sent",
        description: "To Mike Chen",
        amount: -75,
        date: "Nov 3, 4:45 PM",
        icon: Send,
    },
    {
        id: 4,
        type: "credit-purchase",
        title: "Credits Purchase",
        description: "Bought 100 credits",
        amount: -100,
        date: "Nov 2, 11:20 AM",
        icon: ArrowUpRight,
    },
    {
        id: 5,
        type: "transfer-received",
        title: "Transfer Received",
        description: "From John Doe",
        amount: 200,
        date: "Oct 31, 3:00 PM",
        icon: ArrowDownLeft,
    },
    {
        id: 6,
        type: "credit-purchase",
        title: "Credits Purchase",
        description: "Bought 500 credits",
        amount: -500,
        date: "Nov 5, 2:30 PM",
        icon: ArrowUpRight,
    },
    {
        id: 7,
        type: "transfer-received",
        title: "Transfer Received",
        description: "From Sarah Johnson",
        amount: 150,
        date: "Nov 4, 1:15 PM",
        icon: ArrowDownLeft,
    },
    {
        id: 8,
        type: "transfer-sent",
        title: "Transfer Sent",
        description: "To Mike Chen",
        amount: -75,
        date: "Nov 3, 4:45 PM",
        icon: Send,
    },
    {
        id: 9,
        type: "credit-purchase",
        title: "Credits Purchase",
        description: "Bought 100 credits",
        amount: -100,
        date: "Nov 2, 11:20 AM",
        icon: ArrowUpRight,
    },
    {
        id: 10,
        type: "transfer-received",
        title: "Transfer Received",
        description: "From John Doe",
        amount: 200,
        date: "Oct 31, 3:00 PM",
        icon: ArrowDownLeft,
    },
    {
        id: 11,
        type: "credit-purchase",
        title: "Credits Purchase",
        description: "Bought 500 credits",
        amount: -500,
        date: "Nov 5, 2:30 PM",
        icon: ArrowUpRight,
    },
    {
        id: 12,
        type: "transfer-received",
        title: "Transfer Received",
        description: "From Sarah Johnson",
        amount: 150,
        date: "Nov 4, 1:15 PM",
        icon: ArrowDownLeft,
    },
    {
        id: 13,
        type: "transfer-sent",
        title: "Transfer Sent",
        description: "To Mike Chen",
        amount: -75,
        date: "Nov 3, 4:45 PM",
        icon: Send,
    },
    {
        id: 14,
        type: "credit-purchase",
        title: "Credits Purchase",
        description: "Bought 100 credits",
        amount: -100,
        date: "Nov 2, 11:20 AM",
        icon: ArrowUpRight,
    },
    {
        id: 15,
        type: "transfer-received",
        title: "Transfer Received",
        description: "From John Doe",
        amount: 200,
        date: "Oct 31, 3:00 PM",
        icon: ArrowDownLeft,
    },
]

function TransactionItem(transaction: ITransaction) {
    const Icon = transaction.icon
    const isPositive = transaction.amount > 0
    return (
        <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg transition-colors"
        >
            <div className="flex items-center gap-4">
                <div
                    className={`p-3 rounded-full ${isPositive ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-accent"
                        }`}
                >
                    <Icon
                        className={`w-5 h-5 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-accent-foreground"
                            }`}
                    />
                </div>
                <div>
                    <p >{transaction.title}</p>
                    <p className="text-sm text-muted-foreground/60 dark:text-muted-foreground">{transaction.description}</p>
                </div>
            </div>
            <div className="text-right space-y-2">
                <div className="flex items-center justify-end gap-2">
                    <p
                        className={`font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                            }`}
                    >
                        {isPositive ? "+" : ""} {Math.abs(transaction.amount)}
                    </p>
                    <CreditIcon type={isPositive ? "credit" : "debit"} />
                </div>
                <p className="text-xs text-muted-foreground/60 dark:text-muted-foreground">{transaction.date}</p>
            </div>
        </div>
    )
}


const getFilteredTransactions = (txns: typeof transactions, filter?: string) => {
    if (filter === "received") return txns.filter((t) => t.type.includes("received"))
    if (filter === "sent") return txns.filter((t) => t.type.includes("sent") || t.type === "credit-purchase")
    return txns
}

export function Transactions({ filter = "all" }: Transactions) {
    const filteredTransactions = getFilteredTransactions(transactions, filter)

    return (
        <ScrollArea className="h-[500px] pr-2">
            <div className="space-y-3 ">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-400">No transactions yet</p>
                    </div>
                ) :
                    filteredTransactions.map((transaction) => <TransactionItem key={transaction.id} {...transaction} />)
                }
            </div>
        </ScrollArea>
    )
}
