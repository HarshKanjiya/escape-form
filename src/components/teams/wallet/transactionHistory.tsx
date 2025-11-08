import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transactions } from "./transactions";

export default function TransactionHistory() {
    return (
        <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6 shadow-none bg-background dark:bg-muted rounded-xl border-muted">
                <Tabs defaultValue="all" className="w-full">
                    <div className="border-b  p-2 sm:pb-3 px-0 pt-0">
                        <TabsList className="bg-accent h-10 flex items-center justify-between w-full">
                            <TabsTrigger value="all" className=" h-full flex-1 text-center">
                                All Transactions
                            </TabsTrigger>
                            <TabsTrigger value="usage" className=" h-full flex-1 text-center">
                                Usage
                            </TabsTrigger>
                            <TabsTrigger value="received" className=" h-full flex-1 text-center">
                                Received
                            </TabsTrigger>
                            <TabsTrigger value="sent" className=" h-full flex-1 text-center">
                                Sent
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="px-0 py-4">
                        <Transactions />
                    </TabsContent>

                    <TabsContent value="usage" className="px-0 py-4">
                        <Transactions filter="usage" />
                    </TabsContent>

                    <TabsContent value="received" className="px-0 py-4">
                        <Transactions filter="received" />
                    </TabsContent>

                    <TabsContent value="sent" className="px-0 py-4">
                        <Transactions filter="sent" />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}