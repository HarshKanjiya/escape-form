import { cn } from "@/lib/utils";

export function CreditIcon({ className, type = 'default' }: { className?: string, type?: 'credit' | 'debit' | 'default' }) {
    return (
        <div>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                className={cn(
                    "w-5 h-5 text-primary",
                    type != 'default' && (type == 'credit' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"),
                    className)}>
                <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.1" />
                <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M8 8l1 1M16 8l-1 1M8 16l1-1M16 16l-1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </div >
    )
}
