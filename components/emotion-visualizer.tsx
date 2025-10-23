// Author: MANZI RURANGIRWA Elvis

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { loadData, saveData } from "@/lib/storage"
import type { Emotion } from "@/lib/types"
import { Plus, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { cn } from "@/lib/utils"

const emotionTypes = ["joy", "sadness", "anger", "fear", "surprise", "disgust", "calm", "excited"]

export function EmotionVisualizer() {
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEmotion, setNewEmotion] = useState({
    type: "joy",
    intensity: 5,
    note: "",
  })

  useEffect(() => {
    const data = loadData()
    setEmotions(data.emotions)
  }, [])

  const addEmotion = () => {
    const emotion: Emotion = {
      id: `emotion-${Date.now()}`,
      type: newEmotion.type as Emotion["type"],
      intensity: newEmotion.intensity,
      timestamp: new Date().toISOString(),
      note: newEmotion.note || undefined,
    }

    const data = loadData()
    data.emotions.push(emotion)
    saveData(data)
    setEmotions(data.emotions)
    setNewEmotion({ type: "joy", intensity: 5, note: "" })
    setIsDialogOpen(false)
  }

  // Prepare data for line chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  const lineChartData = last7Days.map((date) => {
    const dayEmotions = emotions.filter((e) => typeof e.timestamp === "string" && e.timestamp.startsWith(date))
    const avgIntensity =
      dayEmotions.length > 0 ? dayEmotions.reduce((sum, e) => sum + e.intensity, 0) / dayEmotions.length : 0
    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      intensity: Math.round(avgIntensity * 10) / 10,
    }
  })

  // Prepare data for radar chart (emotion distribution)
  const emotionDistribution = emotionTypes.map((type) => {
    const typeEmotions = emotions.filter((e) => e.type === type)
    const avgIntensity =
      typeEmotions.length > 0 ? typeEmotions.reduce((sum, e) => sum + e.intensity, 0) / typeEmotions.length : 0
    return {
      emotion: type,
      value: Math.round(avgIntensity * 10) / 10,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Log Emotion
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle>Log Your Emotion</DialogTitle>
              <DialogDescription>Record how you're feeling right now with intensity and context</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="emotion-type">Emotion Type</Label>
                <Select value={newEmotion.type} onValueChange={(v) => setNewEmotion({ ...newEmotion, type: v })}>
                  <SelectTrigger id="emotion-type" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emotionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="intensity">Intensity (1-10): {newEmotion.intensity}</Label>
                <input
                  id="intensity"
                  type="range"
                  min="1"
                  max="10"
                  value={newEmotion.intensity}
                  onChange={(e) => setNewEmotion({ ...newEmotion, intensity: Number.parseInt(e.target.value) })}
                  className="w-full mt-2"
                />
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn("flex-1 h-2 rounded-full", i < newEmotion.intensity ? "bg-accent" : "bg-muted")}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  value={newEmotion.note}
                  onChange={(e) => setNewEmotion({ ...newEmotion, note: e.target.value })}
                  placeholder="What triggered this emotion?"
                  className="mt-2"
                />
              </div>
              <Button onClick={addEmotion} className="w-full">
                Log Emotion
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Emotional Intensity (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.03 240 / 0.3)" />
              <XAxis dataKey="date" stroke="oklch(0.65 0.02 240)" />
              <YAxis stroke="oklch(0.65 0.02 240)" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.15 0.02 240 / 0.95)",
                  border: "1px solid oklch(0.25 0.03 240 / 0.5)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="oklch(0.65 0.19 220)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.65 0.19 220)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-6">
          <h3 className="text-xl font-bold mb-4">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={emotionDistribution}>
              <PolarGrid stroke="oklch(0.25 0.03 240 / 0.3)" />
              <PolarAngleAxis dataKey="emotion" stroke="oklch(0.65 0.02 240)" />
              <PolarRadiusAxis domain={[0, 10]} stroke="oklch(0.65 0.02 240)" />
              <Radar
                name="Intensity"
                dataKey="value"
                stroke="oklch(0.55 0.22 280)"
                fill="oklch(0.55 0.22 280)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="glass p-6">
        <h3 className="text-xl font-bold mb-4">Recent Emotions</h3>
        <div className="space-y-3">
          {emotions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No emotions logged yet. Start tracking your feelings!
            </p>
          ) : (
            emotions
              .slice(-10)
              .reverse()
              .map((emotion) => (
                <div key={emotion.id} className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">{emotion.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(emotion.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn("w-full h-2 rounded-full", i < emotion.intensity ? "bg-accent" : "bg-muted")}
                      />
                    ))}
                  </div>
                  {emotion.note && <p className="text-sm text-muted-foreground">{emotion.note}</p>}
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  )
}
