"use client"

import { CreditIcon } from "@/components/shared/creditIcon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"

interface WalletCardProps {
    balance: number
    lastUpdated: string
}

export function WalletCard({ balance, lastUpdated }: WalletCardProps) {
    return (
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-300 via-primary-400 to-primary-800 p-4 sm:p-6 text-white shadow-[inset_0_3px_7px_rgba(255,255,255,0.1),inset_0_-3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.18)] border border-white/30 dark:border-white/15 backdrop-blur-sm">
                <div
                    className="absolute inset-0 mix-blend-hard-light opacity-[0.35]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='white'/%3E%3C/svg%3E")`,
                    }}
                />
                <div className="relative z-10 flex flex-col space-y-4 sm:space-y-6">
                    <div>
                        <p className="text-sm mb-3">Credits Balance</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors">
                                <CreditIcon className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-5xl font-bold text-white tracking-tight">{balance.toFixed(0)}</h2>
                        </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-white/40">
                        <div>
                            <p className="text-primary-50 text-sm font-semibold mb-1 ">Team Created on</p>
                            <p className="font-mono font-semibold text-lg">12 June, 2025</p>
                        </div>
                        <p className="text-primary-50 text-xs">{lastUpdated}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-center">
                <Button
                    variant={'secondary'}
                    size={'icon'}
                    className="h-12 rounded-xl w-12"
                >
                    <Send className="w-5 h-5" />
                </Button>
                <Button
                    className="h-12 rounded-xl flex-1"
                >
                    <CreditIcon className="w-5 h-5" />
                    Buy Credits
                </Button>
            </div>

            <Card className="p-4 sm:p-6 shadow-none bg-background dark:bg-muted rounded-xl border-muted">
                <h3>
                    Statistics
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">This Month</span>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">+450</span>
                            <CreditIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <div className="h-px bg-muted-foreground/30" />
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Spent</span>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold ">-120</span>
                            <CreditIcon className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                    <div className="h-px bg-muted-foreground/30" />
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transferred</span>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">+200</span>
                            <CreditIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
