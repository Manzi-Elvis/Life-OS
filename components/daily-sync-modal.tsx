// Author: MANZI RURANGIRWA Elvis

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { loadData, saveData } from "@/lib/storage"
import type { DailySync } from "@/lib/types"
import { Brain, Heart, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailySyncModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DailySyncModal({ open, onOpenChange }: DailySyncModalProps) {
  const [step, setStep] = useState(1)
  const [syncData, setSyncData] = useState({
    mood: 5,
    energy: 5,
    focus: 5,
    gratitude: "",
    intentions: "",
    reflections: "",
  })

  const handleComplete = () => {
    const sync: DailySync = {
      id: `sync-${Date.now()}`,
      date: new Date().toISOString(),
      mood: syncData.mood,
      energy: syncData.energy,
      focus: syncData.focus,
      gratitude: syncData.gratitude,
      intentions: syncData.intentions,
      reflections: syncData.reflections,
    }

    const data = loadData()
    data.syncs.push(sync)
    saveData(data)

    // Reset and close
    setSyncData({
      mood: 5,
      energy: 5,
      focus: 5,
      gratitude: "",
      intentions: "",
      reflections: "",
    })
    setStep(1)
    onOpenChange(false)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">How's Your Mental State?</h3>
              <p className="text-sm text-muted-foreground">Rate your current levels</p>
            </div>

            <div>
              <Label>Mood (1-10): {syncData.mood}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={syncData.mood}
                onChange={(e) => setSyncData({ ...syncData, mood: Number.parseInt(e.target.value) })}
                className="w-full mt-2"
              />
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("flex-1 h-2 rounded-full", i < syncData.mood ? "bg-primary" : "bg-muted")}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Energy (1-10): {syncData.energy}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={syncData.energy}
                onChange={(e) => setSyncData({ ...syncData, energy: Number.parseInt(e.target.value) })}
                className="w-full mt-2"
              />
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("flex-1 h-2 rounded-full", i < syncData.energy ? "bg-chart-3" : "bg-muted")}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Focus (1-10): {syncData.focus}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={syncData.focus}
                onChange={(e) => setSyncData({ ...syncData, focus: Number.parseInt(e.target.value) })}
                className="w-full mt-2"
              />
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("flex-1 h-2 rounded-full", i < syncData.focus ? "bg-accent" : "bg-muted")}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Gratitude</h3>
              <p className="text-sm text-muted-foreground">What are you grateful for today?</p>
            </div>

            <div>
              <Textarea
                value={syncData.gratitude}
                onChange={(e) => setSyncData({ ...syncData, gratitude: e.target.value })}
                placeholder="I'm grateful for..."
                rows={5}
                className="resize-none"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-chart-3 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Intentions</h3>
              <p className="text-sm text-muted-foreground">What do you want to focus on today?</p>
            </div>

            <div>
              <Textarea
                value={syncData.intentions}
                onChange={(e) => setSyncData({ ...syncData, intentions: e.target.value })}
                placeholder="Today I will..."
                rows={5}
                className="resize-none"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-chart-4 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">Reflections</h3>
              <p className="text-sm text-muted-foreground">Any thoughts or insights?</p>
            </div>

            <div>
              <Textarea
                value={syncData.reflections}
                onChange={(e) => setSyncData({ ...syncData, reflections: e.target.value })}
                placeholder="I noticed that..."
                rows={5}
                className="resize-none"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle>Daily Mental Sync</DialogTitle>
          <DialogDescription>Complete your daily mental check-in to track your well-being</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={cn("flex-1 h-1 rounded-full", s <= step ? "bg-primary" : "bg-muted")} />
            ))}
          </div>

          {renderStep()}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} className="flex-1">
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} className="flex-1">
                Complete Sync
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
