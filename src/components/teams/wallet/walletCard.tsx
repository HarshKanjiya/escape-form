"use client"

import { CreditIcon } from "@/components/shared/creditIcon"

interface WalletCardProps {
    balance: number
    lastUpdated: string
}

export function WalletCard({ balance, lastUpdated }: WalletCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-300 via-primary-400 to-primary-800 p-4 sm:p-6 text-white shadow-[inset_0_3px_7px_rgba(255,255,255,0.1),inset_0_-3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.18)]">
            {/* White noise texture overlay */}
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
                        <p className="text-primary-50 text-sm font-semibold mb-1 ">Member Since</p>
                        <p className="font-mono font-semibold text-lg">12/28</p>
                    </div>
                    <p className="text-primary-50 text-xs">{lastUpdated}</p>
                </div>
            </div>
        </div>
    )
}
