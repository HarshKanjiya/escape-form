"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorPageProps {
    errorCode: 401 | 404 | 405 | 500;
    title?: string;
    description?: string;
    showHomeButton?: boolean;
    homeButtonText?: string;
    redirectPath?: string;
}

const ERROR_MESSAGES = {
    401: {
        title: "Access Denied",
        subtitle: "you're not <span class='italic'>authorized</span> 🔒",
        description: "You don't have permission to access this resource. Please log in with appropriate credentials or contact support if you believe this is an error."
    },
    404: {
        title: "This is not the page",
        subtitle: "you're <span class='italic'>looking for</span> 👀",
        description: "We can't find that page, but you can always chat with our team if you have a question or need support."
    },
    405: {
        title: "Method Not Allowed",
        subtitle: "this action is <span class='italic'>not permitted</span> ⚠️",
        description: "The request method is not supported for this resource. Please check your request and try again."
    },
    500: {
        title: "Something went wrong",
        subtitle: "on <span class='italic'>our end</span> 🛠️",
        description: "We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue."
    }
};

export default function ErrorPage({
    errorCode,
    title,
    description,
    showHomeButton = true,
    homeButtonText = "Back to Home",
    redirectPath = "/"
}: ErrorPageProps) {
    const errorMessage = ERROR_MESSAGES[errorCode];
    const displayTitle = title || errorMessage.title;
    const displayDescription = description || errorMessage.description;

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background gradient, adaptive to theme */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(circle at center, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
                        var(--error-bg-gradient)
                    `
                }}
            />

            {/* Border frame, adaptive to theme */}
            <div className="absolute inset-4 border rounded-lg pointer-events-none border-black/10 dark:border-white/20" />

            {/* Large background error code effect, adaptive to theme */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div
                    className="text-[40rem] md:text-[50rem] font-bold opacity-[0.04] dark:opacity-[0.02] text-black dark:text-white leading-none select-none"
                    style={{
                        transform: 'translateY(-10%)',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    {errorCode}
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
                {/* Top line decoration */}
                <div className="w-24 h-px bg-black/10 dark:bg-white/30 mb-12"></div>

                {/* Main content */}
                <div className="max-w-lg space-y-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm tracking-wide">Oops!</p>

                    <h1 className="text-black dark:text-white text-4xl md:text-5xl font-light leading-tight">
                        {displayTitle}<br />
                        <span dangerouslySetInnerHTML={{ __html: errorMessage.subtitle }} />
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                        {displayDescription}
                    </p>

                    {showHomeButton && (
                        <div className="pt-4">
                            <Link href={redirectPath}>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    {homeButtonText}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="w-24 h-px bg-black/10 dark:bg-white/30 mt-12"></div>
            </div>
            {/* Theme-adaptive background gradient CSS variable */}
            <style jsx global>{`
                :root {
                    --error-bg-gradient: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%);
                }
                html.dark {
                    --error-bg-gradient: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #000000 100%);
                }
            `}</style>
        </div>
    )
}