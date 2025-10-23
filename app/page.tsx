// Author: MANZI RURANGIRWA Elvis

"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { PWAInstaller } from "@/components/pwa-installer"
import { loadData } from "@/lib/storage"
import type { LifeOSData } from "@/lib/types"
import { Brain, Lightbulb, Heart, Target, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  const [data, setData] = useState<LifeOSData | null>(null)

  useEffect(() => {
    setData(loadData())
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground">Initializing LifeOS...</p>
        </div>
      </div>
    )
  }

  const todayEmotions = data.emotions.filter((e) => new Date(e.timestamp).toDateString() === new Date().toDateString())

  const todaySync = data.syncs.find((s) => new Date(s.date).toDateString() === new Date().toDateString())

  const stats = [
    {
      icon: Lightbulb,
      label: "Active Thoughts",
      value: data.thoughts.length,
      color: "from-primary to-primary/50",
    },
    {
      icon: Heart,
      label: "Today's Emotions",
      value: todayEmotions.length,
      color: "from-accent to-accent/50",
    },
    {
      icon: Target,
      label: "Daily Sync",
      value: todaySync ? "Complete" : "Pending",
      color: "from-chart-3 to-chart-3/50",
    },
    {
      icon: TrendingUp,
      label: "Total Syncs",
      value: data.syncs.length,
      color: "from-chart-4 to-chart-4/50",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <PWAInstaller />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 gradient-text">Welcome to Your Mind</h2>
          <p className="text-muted-foreground text-lg">Your personal mental operating system is ready</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="glass p-6 hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                      stat.color,
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Recent Thoughts
            </h3>
            {data.thoughts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No thoughts yet. Start mapping your mind!</p>
            ) : (
              <div className="space-y-3">
                {data.thoughts
                  .slice(-5)
                  .reverse()
                  .map((thought) => (
                    <div
                      key={thought.id}
                      className="p-4 rounded-lg bg-secondary/50 border border-border/30 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {thought.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(thought.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{thought.content}</p>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Emotional Pulse
            </h3>
            {todayEmotions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No emotions logged today. How are you feeling?</p>
            ) : (
              <div className="space-y-3">
                {todayEmotions
                  .slice(-5)
                  .reverse()
                  .map((emotion) => (
                    <div key={emotion.id} className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{emotion.type}</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn("w-2 h-6 rounded-full", i < emotion.intensity ? "bg-accent" : "bg-muted")}
                            />
                          ))}
                        </div>
                      </div>
                      {emotion.note && <p className="text-xs text-muted-foreground">{emotion.note}</p>}
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
