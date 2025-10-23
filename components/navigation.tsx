"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Lightbulb, Heart, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DailySyncModal } from "@/components/daily-sync-modal"

const navItems = [
  { href: "/", label: "Dashboard", icon: Brain },
  { href: "/thoughts", label: "Thought Map", icon: Lightbulb },
  { href: "/emotions", label: "Emotions", icon: Heart },
]

export function Navigation() {
  const pathname = usePathname()
  const [isSyncOpen, setIsSyncOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl gradient-text">LifeOS</span>
            </Link>

            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}

              <Button onClick={() => setIsSyncOpen(true)} variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Daily Sync
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <DailySyncModal open={isSyncOpen} onOpenChange={setIsSyncOpen} />
    </>
  )
}
