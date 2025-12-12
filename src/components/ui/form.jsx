import * as React from "react"
import { Label } from "./label"
import { cn } from "@/lib/utils"

const Form = ({ className, ...props }) => (
  <form className={cn("space-y-4", className)} {...props} />
)

const FormField = ({ className, ...props }) => (
  <div className={cn("space-y-2", className)} {...props} />
)

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <Label ref={ref} className={className} {...props} />
))
FormLabel.displayName = "FormLabel"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  if (!children) return null
  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export { Form, FormField, FormLabel, FormDescription, FormMessage }

