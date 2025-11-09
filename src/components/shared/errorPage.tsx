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
        subtitle: "you're not <span class='italic text-gray-300'>authorized</span> 🔒",
        description: "You don't have permission to access this resource. Please log in with appropriate credentials or contact support if you believe this is an error."
    },
    404: {
        title: "This is not the page",
        subtitle: "you're <span class='italic text-gray-300'>looking for</span> 👀",
        description: "We can't find that page, but you can always chat with our team if you have a question or need support."
    },
    405: {
        title: "Method Not Allowed",
        subtitle: "this action is <span class='italic text-gray-300'>not permitted</span> ⚠️",
        description: "The request method is not supported for this resource. Please check your request and try again."
    },
    500: {
        title: "Something went wrong",
        subtitle: "on <span class='italic text-gray-300'>our end</span> 🛠️",
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
            {/* Background gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(circle at center, rgba(30, 58, 138, 0.3) 0%, transparent 50%),
                        linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #000000 100%)
                    `
                }}
            />
            
            {/* White border frame */}
            <div className="absolute inset-4 border border-white/20 rounded-lg pointer-events-none" />
            
            {/* Large background error code effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div
                    className="text-[40rem] md:text-[50rem] font-bold opacity-[0.02] text-white leading-none select-none"
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
                <div className="w-24 h-px bg-white/30 mb-12"></div>

                {/* Main content */}
                <div className="max-w-lg space-y-6">
                    <p className="text-gray-400 text-sm tracking-wide">Oops!</p>

                    <h1 className="text-white text-4xl md:text-5xl font-light leading-tight">
                        {displayTitle}<br />
                        <span dangerouslySetInnerHTML={{ __html: errorMessage.subtitle }} />
                    </h1>

                    <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                        {displayDescription}
                    </p>

                    {showHomeButton && (
                        <div className="pt-4">
                            <Link href={redirectPath}>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                                >
                                    {homeButtonText}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="w-24 h-px bg-white/30 mt-12"></div>
            </div>
        </div>
    )
}