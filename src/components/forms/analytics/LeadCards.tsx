import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TablePropertiesIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
    { "month": "January", "Unfinished": 211, "Completed": 185 },
    { "month": "February", "Unfinished": 340, "Completed": 88 },
    { "month": "March", "Unfinished": 75, "Completed": 260 },
    { "month": "April", "Unfinished": 182, "Completed": 115 },
    { "month": "May", "Unfinished": 290, "Completed": 230 },
    { "month": "June", "Unfinished": 58, "Completed": 95 },
    { "month": "July", "Unfinished": 120, "Completed": 201 },
    { "month": "August", "Unfinished": 301, "Completed": 295 },
    { "month": "September", "Unfinished": 150, "Completed": 160 },
    { "month": "October", "Unfinished": 333, "Completed": 78 },
    { "month": "November", "Unfinished": 99, "Completed": 250 },
    { "month": "December", "Unfinished": 245, "Completed": 105 }
]

const chartConfig = {
    desktop: {
        label: "Unfinished",
        color: "var(--color-indigo-300)",
    },
    mobile: {
        label: "Completed",
        color: "var(--color-indigo-600)",
    },
} satisfies ChartConfig


export default function LeadCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            <div className="col-span-3 flex flex-col gap-6">
                <Card className="col-span-3 !px-0 !py-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-300 via-primary-400 to-primary-800 text-white shadow-[inset_0_3px_7px_rgba(255,255,255,0.1),inset_0_-3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.18)] border border-white/30 dark:border-white/15 backdrop-blur-sm border-none">
                    <div
                        className="absolute inset-0 mix-blend-hard-light opacity-[0.35]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='white'/%3E%3C/svg%3E")`,
                        }}
                    />
                    <CardContent className="relative z-10 flex flex-col space-y-4 sm:space-y-6">
                        <div className="w-min">
                            <TablePropertiesIcon className="h-12 w-12 rounded-xl p-2.5 border-2 border-white/20 bg-gradient-to-br from-white/10 via-white/20 to-white/5 text-white/60" />
                        </div>
                        <div>
                            <p className="text-sm mb-3">Today's Responses</p>
                            <div className="flex items-end gap-3 ">
                                <h2 className="text-5xl font-bold font-mono text-white tracking-tight">3</h2>
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
                <Card className="flex-1 shadow-none !p-0">
                    <CardContent className="p-0 h-full">
                        <div className="flex flex-col gap-2 h-full">
                            <div className="flex-1 px-4 pb-3 pt-4 flex flex-col justify-center items-start">
                                <p className="text-sm mb-3">Average Completion Time</p>
                                <div className="flex items-end gap-3 ">
                                    <h2 className="text-5xl font-bold font-mono text-white tracking-tight">29 sec</h2>
                                </div>
                            </div>
                            <div className="flex items-center justify-start border-t px-4 py-3">
                                <p>
                                    <span className="text-muted-foreground">Min</span>
                                    <span className="font-mono">34 sec</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Max</span>
                                    <span className="font-mono">34 sec</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="col-span-3 flex flex-col gap-6">
                <Card className="flex-1 shadow-none">
                    <CardContent>
                        <div>
                            <p className="text-sm mb-3">Form Opened</p>
                            <div className="flex items-end gap-3 ">
                                <h2 className="text-5xl font-bold font-mono text-white tracking-tight">235</h2>
                                <p className="text-muted-foreground">Times</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1 shadow-none">
                    <CardContent>
                        <div>
                            <p className="text-sm mb-3">Form Submitted</p>
                            <div className="flex items-end gap-3 ">
                                <h2 className="text-5xl font-bold font-mono text-white tracking-tight">45</h2>
                                <p className="text-muted-foreground">Times</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex-1 shadow-none">
                    <CardContent>
                        <div>
                            <p className="text-sm mb-3">Completion Ration</p>
                            <div className="flex items-end gap-3 ">
                                <h2 className="text-5xl font-bold font-mono text-white tracking-tight">80%</h2>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="col-span-6 shadow-none !p-0">
                <CardContent className="p-0">
                    <div className="flex items-center justify-end border-b">
                        <div className="px-4 py-3 flex items-baseline justify-center gap-2 border-l">
                            <div className="bg-indigo-300 rounded-full h-4 w-4" />
                            <p className="text-muted-foreground">Unfinished</p>
                            <p className="font-mono text-accent-foreground text-2xl">15</p>
                        </div>
                        <div className="px-4 py-3 flex items-baseline justify-center gap-2 border-l ">
                            <div className="bg-indigo-600 rounded-full h-4 w-4" />
                            <p className="text-muted-foreground">Completed</p>
                            <p className="font-mono text-accent-foreground text-2xl">12</p>
                        </div>
                    </div>
                    <div className="px-0 pb-3 pr-4">
                        <ChartContainer config={chartConfig}>
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <YAxis
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    ticks={[50, 100, 150, 200, 250, 300, 350, 400, 450]}
                                    domain={[0, 500]}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="Unfinished"
                                    stackId="a"
                                    fill="var(--color-desktop)"
                                    radius={[4, 4, 4, 4]}
                                />
                                <Bar
                                    dataKey="Completed"
                                    stackId="b"
                                    fill="var(--color-mobile)"
                                    radius={[4, 4, 4, 4]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}