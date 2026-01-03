import * as React from "react"

// Radix slot is useful but I might not have installed @radix-ui/react-slot.
// I'll stick to simple forwardRef for now to avoid extra dependencies I haven't installed yet.
// Actually, simple button is fine.
import { cn } from "@/lib/utils"
// import { cva, type VariantProps } from "class-variance-authority"
// I didn't install cva. I'll use simple conditional classes or switch to installing cva/clsx/tailwind-merge properly if needed.
// I installed clsx and tailwind-merge. I can manually handle variants or just install cva now.
// It's better to install cva, but I can also just write a simple utility.
// Let's use standard manual cn implementation for now to save time on installs, or I can install cva quickly.
// Standard Shadcn uses cva. It's clean. I'll stick to a robust manual implementation to avoid another install await.

/*
  I will use a simple map or just conditional logic for variants.
*/

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    asChild?: boolean; // skipping asChild implementation to avoid radix-slot dep
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
