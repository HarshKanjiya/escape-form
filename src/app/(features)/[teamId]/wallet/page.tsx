import { IconCard } from "@/components/shared/iconCard";
import TransactionHistory from "@/components/teams/wallet/transactionHistory";
import { WalletCard } from "@/components/teams/wallet/walletCard";
import { Wallet } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wallet - Escape Form",
    description: "Manage your credits and transfer funds with ease.",
    applicationName: "Escape Form",
    keywords: "escape form, esc form, esc form sign in, escape form sign in, form builder, online forms, form management, data collection, surveys, team collaboration",
    creator: "Escape Form",
    authors: [{ name: "Escape Form", url: "https://escform.com" }],
    publisher: "Escape Form",
    openGraph: {
        title: "Wallet - Escape Form",
        description: "Manage your credits and transfer funds with ease.",
        url: "https://dashboard.escform.com/wallet",
        siteName: "Escape Form",
        type: "website",
    }
}

export default function WalletPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="space-y-6 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <IconCard icon={Wallet} />
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
                <WalletCard balance={1250.5} lastUpdated="Updated now" />
                <TransactionHistory />
            </div>
        </div>
    );
}