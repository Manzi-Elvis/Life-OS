// Author: MANZI RURANGIRWA Elvis

"use client"

import { Navigation } from "@/components/navigation"
import { ThoughtMap } from "@/components/thought-map"

export default function ThoughtsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 gradient-text">Thought Map</h2>
          <p className="text-muted-foreground text-lg">Visualize and connect your ideas</p>
        </div>
        <ThoughtMap />
      </main>
    </div>
  )
}
