import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, type = 'text', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={type}
                        className={cn(
                            'h-12 w-full rounded-xl border bg-white px-4 text-base transition-all duration-200',
                            'placeholder:text-neutral-400',
                            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                            'dark:border-dark-border dark:bg-dark-surface dark:text-white',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            icon && 'pl-12',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export { Input };
