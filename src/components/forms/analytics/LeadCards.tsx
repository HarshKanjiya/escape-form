"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CustomCard, CustomCardContent, CustomCardFooter, CustomCardHeader, CustomCardTitle } from "@/components/ui/custom-card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiConstants } from "@/constants/api.constants";
import api from "@/lib/axios";
import { showError } from "@/lib/utils";
import { IFormAnalytics } from "@/types/form";
import { Form } from "@prisma/client";
import { Loader2Icon, TablePropertiesIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

interface LeadCardsProps {
    form: Form;
}

export default function LeadCards({ form }: LeadCardsProps) {

    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState<IFormAnalytics | null>(null);

    const fetchData = useCallback(async () => {
        if (!form?.id) return;
        try {
            setLoading(true);
            const res = await api.get(apiConstants.dashboard.getAnalytics(form.id))
            setLoading(false);
            const data = await res.data;
            setAnalytics(data.data);
        } catch (error: any) {
            setLoading(false);
            showError(error.message || 'Failed to fetch analytics');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <SkeletonLeadCards />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-3 flex flex-col gap-6">
                <Card className="col-span-3 px-0! py-4! relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-300 via-primary-400 to-primary-800 text-white shadow-[inset_0_3px_7px_rgba(255,255,255,0.1),inset_0_-3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.18)] border border-white/30 dark:border-white/15 backdrop-blur-sm border-none">
                    <div
                        className="absolute inset-0 mix-blend-hard-light opacity-[0.35]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='white'/%3E%3C/svg%3E")`,
                        }}
                    />
                    <CardContent className="relative z-10 flex flex-col space-y-4 sm:space-y-6">
                        <div className="w-min">
                            <TablePropertiesIcon className="h-12 w-12 rounded-xl p-2.5 border-2 border-white/20 bg-linear-to-br from-white/10 via-white/20 to-white/5 text-white/60" />
                        </div>
                        <div>
                            <p className="text-sm mb-3">Today&apos;s Responses</p>
                            <div className="flex items-end gap-3 ">
                                <h2 className="text-5xl font-bold font-mono text-white tracking-tight">{analytics?.todayResponseCount || 0}</h2>
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-4 border-t border-white/40">
                            <div className="flex gap-2 items-end">
                                <p className="font-mono font-semibold text-lg">{analytics?.responseCount || 0}</p>
                                <p className="text-primary-50 text-sm font-semibold mb-1 ">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <CustomCard>
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Average Completion Time
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <h2 className="text-4xl py-5 font-bold font-mono tracking-tight">{analytics?.avgCompletionTime} sec</h2>
                    </CustomCardContent>
                    <CustomCardFooter className="justify-start gap-4">
                        <p className="space-x-2">
                            <span className="text-muted-foreground">Min:</span>
                            <span>{analytics?.minCompletionTime || 0} sec</span>
                        </p>
                        <p className="space-x-2">
                            <span className="text-muted-foreground">Max:</span>
                            <span>{analytics?.maxCompletionTime || 0} sec</span>
                        </p>
                    </CustomCardFooter>
                </CustomCard>
            </div>
            <div className="col-span-3 flex flex-col gap-6">
                <CustomCard className="flex-1">
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Form Opened
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <div className="flex items-end gap-3 relative">
                            <h2 className="text-5xl font-bold font-mono tracking-tight">{analytics?.opened}</h2>
                            <p className="text-muted-foreground absolute text-sm bottom-1 -right-12">Times</p>
                        </div>
                    </CustomCardContent>
                </CustomCard>
                <CustomCard className="flex-1">
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Form Submitted
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <div className="flex items-end gap-3 relative">
                            <h2 className="text-5xl font-bold font-mono tracking-tight">{analytics?.submitted}</h2>
                            <p className="text-muted-foreground absolute text-sm bottom-1 -right-12">Times</p>
                        </div>
                    </CustomCardContent>
                </CustomCard>
                <CustomCard className="flex-1">
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Completion Ration
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <div className="flex items-end gap-3 ">
                            <h2 className="text-5xl font-bold font-mono tracking-tight">{analytics?.completionRate}%</h2>
                        </div>
                    </CustomCardContent>
                </CustomCard>
            </div>
            <CustomCard className="col-span-6">
                <CustomCardHeader>
                    <div className="flex items-center justify-start gap-4">
                        <div className="flex items-center justify-center gap-2">
                            <div className="bg-indigo-300 rounded-full h-3 w-3" />
                            <p>Unfinished</p>
                            <p className="text-accent-foreground">{(analytics?.opened || 0) - (analytics?.submitted || 0)}</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 ">
                            <div className="bg-indigo-600 rounded-full h-3 w-3" />
                            <p>Completed</p>
                            <p className="text-accent-foreground">{analytics?.submitted || 0}</p>
                        </div>
                    </div>
                </CustomCardHeader>
                <div className="p-[4px]">
                    <div className="p-4 flex-1 h-full bg-background dark:bg-accent dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] rounded-xl">
                        <div className="px-0 pb-3 pr-4">
                            <ChartContainer config={chartConfig}>
                                <BarChart accessibilityLayer data={analytics?.submitDataPoints || []} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} >
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
                                        ticks={[5, 10, 50, 100, 150, 200,]}
                                        domain={[0, 200]}
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
                    </div>
                </div>
            </CustomCard>
        </div>
    );
}

const SkeletonLeadCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="col-span-3 flex flex-col gap-6">
                <Card className="col-span-3 px-0! py-4! relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-300 via-primary-400 to-primary-800 text-white shadow-[inset_0_3px_7px_rgba(255,255,255,0.1),inset_0_-3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.18)] border border-white/30 dark:border-white/15 backdrop-blur-sm border-none">
                    <div
                        className="absolute inset-0 mix-blend-hard-light opacity-[0.35]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='white'/%3E%3C/svg%3E")`,
                        }}
                    />
                    <CardContent className="relative z-10 flex flex-col space-y-4 sm:space-y-6">
                        <div className="w-min">
                            <TablePropertiesIcon className="h-12 w-12 rounded-xl p-2.5 border-2 border-white/20 bg-linear-to-br from-white/10 via-white/20 to-white/5 text-white/60" />
                        </div>
                        <div>
                            <p className="text-sm mb-3">Today&apos;s Responses</p>
                            <div className="flex items-end gap-3 ">
                                <Skeleton className="h-[60px] w-32 bg-white/20" />
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-4 border-t border-white/40">
                            <div className="flex gap-2 items-end">
                                <Skeleton className="h-7 w-12 bg-white/20" />
                                <p className="text-primary-50 text-sm font-semibold mb-1 ">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <CustomCard>
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Average Completion Time
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <div className="h-14 flex items-center justify-center">
                            <Loader2Icon className="m-auto h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    </CustomCardContent>
                    <CustomCardFooter className="justify-start gap-4">
                        <div className="flex gap-2">
                            <p className="text-muted-foreground">Min:</p>
                            <Skeleton className="h-6 w-16" />
                        </div>
                        <div className="flex gap-2">
                            <p className="text-muted-foreground">Max:</p>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </CustomCardFooter>
                </CustomCard>
            </div>
            <div className="col-span-3 flex flex-col gap-6">
                <CustomCard className="flex-1">
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Form Opened
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <div className="h-[60px] flex items-center justify-center">
                            <Loader2Icon className="m-auto h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    </CustomCardContent>
                </CustomCard>
                <CustomCard className="flex-1">
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Form Submitted
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <div className="h-[60px] flex items-center justify-center">
                            <Loader2Icon className="m-auto h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    </CustomCardContent>
                </CustomCard>
                <CustomCard className="flex-1">
                    <CustomCardHeader>
                        <CustomCardTitle>
                            Completion Ration
                        </CustomCardTitle>
                    </CustomCardHeader>
                    <CustomCardContent>
                        <div className="h-[60px] flex items-center justify-center">
                            <Loader2Icon className="m-auto h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    </CustomCardContent>
                </CustomCard>
            </div>
            <CustomCard className="col-span-6">
                <CustomCardHeader>
                    <div className="flex items-center justify-start gap-4">
                        <div className="flex items-center justify-center gap-2">
                            <div className="bg-indigo-300 rounded-full h-3 w-3" />
                            <p>Unfinished</p>
                            <Skeleton className="h-6 w-8" />
                        </div>
                        <div className="flex items-center justify-center gap-2 ">
                            <div className="bg-indigo-600 rounded-full h-3 w-3" />
                            <p>Completed</p>
                            <Skeleton className="h-6 w-8" />
                        </div>
                    </div>
                </CustomCardHeader>
                <div className="p-[4px]">
                    <div className="p-4 flex-1 h-full bg-background dark:bg-accent dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] rounded-xl">
                        <div className="px-0 pb-3 pr-4">
                            <div className="h-[380px] flex items-center justify-center">
                                <Loader2Icon className="m-auto h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
            </CustomCard>
        </div>
    )
}