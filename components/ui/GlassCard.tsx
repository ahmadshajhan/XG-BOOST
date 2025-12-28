import clsx from 'clsx';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                "backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-2xl overflow-hidden",
                "transition-all duration-300 hover:border-white/20",
                className
            )}
        >
            {children}
        </div>
    );
}
