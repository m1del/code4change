import * as React from "react";

import { cn } from "@/lib/utils";
import { FadeIn } from "../Animation/FadeIn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <FadeIn direction="left" width="100%" delay={0.25}>
        <input
          type={type}
          className={cn(
            "flex h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </FadeIn>
    );
  }
);
Input.displayName = "Input";

export { Input };
