import { LucideIcon } from "lucide-react";
import React from "react";

interface IconCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
}

export function IconCard({ icon: Icon }: IconCardProps) {
    return (
        <div className="aspect-square relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-primary-500/90 via-primary-600 to-primary-400/70 dark:from-primary-500/90 dark:via-primary-600/80 dark:to-primary-700/70 backdrop-blur-md text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2),inset_1px_0_0_rgba(255,255,255,0.15),inset_-1px_0_0_rgba(0,0,0,0.15),inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-6px_16px_rgba(0,0,0,0.2),0_4px_20px_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.05)] border border-white/10 dark:border-white/20 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3),inset_1px_0_0_rgba(255,255,255,0.2),inset_-1px_0_0_rgba(0,0,0,0.2),inset_0_2px_12px_rgba(255,255,255,0.15),inset_0_-8px_20px_rgba(0,0,0,0.25),0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]">
            <div
                className="absolute inset-0 mix-blend-hard-light opacity-[0.35]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='white'/%3E%3C/svg%3E")`,
                }}
            />
            <Icon className="w-8 h-8 text-primary-200 dark:text-primary-900" />
        </div>
    )
}
