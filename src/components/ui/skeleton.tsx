import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}


function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        {...props}
    />
  )
}


export { Skeleton, Card }
