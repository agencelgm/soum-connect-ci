import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type RequiredLabelProps = React.ComponentPropsWithoutRef<typeof Label> & {
  required?: boolean;
};

export function RequiredLabel({
  children,
  required = true,
  className,
  ...props
}: RequiredLabelProps) {
  return (
    <Label className={cn(className)} {...props}>
      {children}
      {required && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  );
}