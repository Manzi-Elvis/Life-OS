// Author: MANZI RURANGIRWA Elvis

"use client"

import { Navigation } from "@/components/navigation"
import { EmotionVisualizer } from "@/components/emotion-visualizer"

export default function EmotionsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 gradient-text">Emotion Visualizer</h2>
          <p className="text-muted-foreground text-lg">Track and understand your emotional patterns</p>
        </div>
        <EmotionVisualizer />
      </main>
    </div>
  )
}
