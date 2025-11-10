import { Card, CardContent } from "@/components/ui/card";
import { SaveAllIcon, TrendingUpIcon } from "lucide-react";

export default function LeadCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Card className="col-span-3 !px-0 !py-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-300 via-primary-400 to-primary-800 text-white shadow-[inset_0_3px_7px_rgba(255,255,255,0.1),inset_0_-3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.18)] border border-white/30 dark:border-white/15 backdrop-blur-sm border-none">
                <div
                    className="absolute inset-0 mix-blend-hard-light opacity-[0.35]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='white'/%3E%3C/svg%3E")`,
                    }}
                />
                <CardContent className="relative z-10 flex flex-col space-y-4 sm:space-y-6">
                    <div className="w-min">
                        <SaveAllIcon className="h-12 w-12 rounded-xl p-2.5 border-2 border-white/20 bg-gradient-to-br from-white/10 via-white/20 to-white/5 text-white/60" />
                    </div>
                    <div>
                        <p className="text-sm mb-3">Today's Responses</p>
                        <div className="flex items-end gap-3 ">
                            <h2 className="text-5xl font-bold font-mono text-white tracking-tight">3</h2>
                            <div className="text-emerald-300 flex items-center gap-1">
                                <span className="font-mono">23%</span>
                                <TrendingUpIcon className="h-6 w-6 text-emerald-300 rounded-full p-0.5" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-white/40">
                        <div className="flex gap-2 items-end">
                            <p className="font-mono font-semibold text-lg">154</p>
                            <p className="text-primary-50 text-sm font-semibold mb-1 ">Total</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="col-span-3 flex flex-col gap-6">
                <Card className="flex-1 shadow-none">
                    <CardContent></CardContent>
                </Card>
                <Card className="flex-1 shadow-none">
                    <CardContent></CardContent>
                </Card>
            </div>
            <Card className="col-span-6 shadow-none">
                <CardContent></CardContent>
            </Card>
        </div>
    );
}