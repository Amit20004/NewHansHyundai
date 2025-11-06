import React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  icon?: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          "flex items-center gap-2 text-foreground/80",
          className
        )}
        {...props}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };