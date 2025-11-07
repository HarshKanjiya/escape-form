"use client"

import { CreditIcon } from "@/components/shared/creditIcon"
import { ArrowUpRight, ArrowDownLeft, Send } from "lucide-react"

interface TransactionHistoryProps {
    filter?: "all" | "received" | "sent"
}

const transactions = [
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
]

const getFilteredTransactions = (txns: typeof transactions, filter?: string) => {
    if (filter === "received") return txns.filter((t) => t.type.includes("received"))
    if (filter === "sent") return txns.filter((t) => t.type.includes("sent") || t.type === "credit-purchase")
    return txns
}

export function TransactionHistory({ filter = "all" }: TransactionHistoryProps) {
    const filteredTransactions = getFilteredTransactions(transactions, filter)

    return (
        <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">No transactions yet</p>
                </div>
            ) : (
                filteredTransactions.map((transaction) => {
                    const Icon = transaction.icon
                    const isPositive = transaction.amount > 0

                    return (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-3 rounded-full ${isPositive ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-slate-100 dark:bg-slate-700"
                                        }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"
                                            }`}
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{transaction.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.description}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    <p
                                        className={`font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                                            }`}
                                    >
                                        {isPositive ? "+" : ""} {Math.abs(transaction.amount)}
                                    </p>
                                    <CreditIcon
                                        className={`w-5 h-5 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                                    />
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{transaction.date}</p>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}
