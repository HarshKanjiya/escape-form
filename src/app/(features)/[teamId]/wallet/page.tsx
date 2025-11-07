import { CreditIcon } from "@/components/shared/creditIcon";
import { TransactionHistory } from "@/components/teams/wallet/transactionHistory";
import { WalletCard } from "@/components/teams/wallet/walletCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Wallet } from "lucide-react";

export default function WalletPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="space-y-6 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0 outline-2 outline-offset-3 outline-primary/20">
                            <Wallet className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-medium">Credits Wallet</h1>
                            <p className="text-muted-foreground">
                                Manage your credits and transfer funds with ease
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Wallet Card and Actions */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                    <WalletCard balance={1250.5} lastUpdated="Updated now" />

                    {/* Action Buttons */}
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

                    <Card className="p-4 sm:p-6 shadow-none bg-background dark:bg-muted rounded-xl">
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

                {/* Right Column - Transactions */}
                <div className="lg:col-span-2">
                    <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-sm overflow-hidden shadow-lg">
                        <Tabs defaultValue="all" className="w-full">
                            <div className="border-b border-slate-200 dark:border-slate-700 px-6 pt-6">
                                <TabsList className="bg-slate-100 dark:bg-slate-700/50 p-1.5 rounded-lg">
                                    <TabsTrigger value="all" className="text-sm font-medium">
                                        All Transactions
                                    </TabsTrigger>
                                    <TabsTrigger value="received" className="text-sm font-medium">
                                        Received
                                    </TabsTrigger>
                                    <TabsTrigger value="sent" className="text-sm font-medium">
                                        Sent
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="all" className="p-6">
                                <TransactionHistory />
                            </TabsContent>

                            <TabsContent value="received" className="p-6">
                                <TransactionHistory filter="received" />
                            </TabsContent>

                            <TabsContent value="sent" className="p-6">
                                <TransactionHistory filter="sent" />
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
}