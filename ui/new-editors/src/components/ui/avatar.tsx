import * as React from "react";

import { cn } from "../../lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: string;
    initials: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, color, initials, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold", className)}
        style={color ? { backgroundColor: color, color: "#fff" } : undefined}
        {...props}
    >
        {initials}
    </div>
));
Avatar.displayName = "Avatar";
