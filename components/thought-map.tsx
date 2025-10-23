// Author: MANZI RURANGIRWA Elvis

"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
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
import type { Thought } from "@/lib/types"
import { Plus, Trash2, Link2 } from "lucide-react"
import { Card } from "@/components/ui/card"

const categories = ["idea", "goal", "memory", "question", "insight", "task"]

interface ThoughtNode {
  id: string
  content: string
  category: string
  x: number
  y: number
  connections: string[]
}

export function ThoughtMap() {
  const [thoughts, setThoughts] = useState<ThoughtNode[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newThought, setNewThought] = useState({ content: "", category: "idea" })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Load thoughts from storage
  useEffect(() => {
    const data = loadData()
    const thoughtNodes: ThoughtNode[] = data.thoughts.map((thought, index) => ({
      id: thought.id,
      content: thought.content,
      category: thought.category,
      x: (index % 5) * 250 + 50,
      y: Math.floor(index / 5) * 200 + 50,
      connections: thought.connections || [],
    }))
    setThoughts(thoughtNodes)
  }, [])

  const addThought = () => {
    if (!newThought.content.trim()) return

    const data = loadData()
    const thought: Thought = {
      id: `thought-${Date.now()}`,
      content: newThought.content,
      category: newThought.category as Thought["category"],
      createdAt: new Date().toISOString(),
      connections: [],
    }

    data.thoughts.push(thought)
    saveData(data)

    const newNode: ThoughtNode = {
      id: thought.id,
      content: thought.content,
      category: thought.category,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      connections: [],
    }

    setThoughts((prev) => [...prev, newNode])
    setNewThought({ content: "", category: "idea" })
    setIsDialogOpen(false)
  }

  const deleteSelectedNode = () => {
    if (!selectedNode) return

    const data = loadData()
    data.thoughts = data.thoughts.filter((t) => t.id !== selectedNode)
    data.thoughts.forEach((t) => {
      if (t.connections) {
        t.connections = t.connections.filter((c) => c !== selectedNode)
      }
    })
    saveData(data)

    setThoughts((prev) => prev.filter((t) => t.id !== selectedNode))
    setSelectedNode(null)
  }

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (connectingFrom) return

    const node = thoughts.find((t) => t.id === nodeId)
    if (!node) return

    setDraggingNode(nodeId)
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    })
    setSelectedNode(nodeId)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    setThoughts((prev) => prev.map((t) => (t.id === draggingNode ? { ...t, x: Math.max(0, x), y: Math.max(0, y) } : t)))
  }

  const handleMouseUp = () => {
    setDraggingNode(null)
  }

  const startConnecting = (nodeId: string) => {
    setConnectingFrom(nodeId)
  }

  const finishConnecting = (targetId: string) => {
    if (!connectingFrom || connectingFrom === targetId) {
      setConnectingFrom(null)
      return
    }

    const data = loadData()
    const sourceThought = data.thoughts.find((t) => t.id === connectingFrom)
    if (sourceThought) {
      if (!sourceThought.connections) {
        sourceThought.connections = []
      }
      if (!sourceThought.connections.includes(targetId)) {
        sourceThought.connections.push(targetId)
        saveData(data)

        setThoughts((prev) =>
          prev.map((t) => (t.id === connectingFrom ? { ...t, connections: [...t.connections, targetId] } : t)),
        )
      }
    }

    setConnectingFrom(null)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      idea: "oklch(0.65 0.19 220)",
      goal: "oklch(0.65 0.19 280)",
      memory: "oklch(0.65 0.19 180)",
      question: "oklch(0.65 0.19 320)",
      insight: "oklch(0.65 0.19 60)",
      task: "oklch(0.65 0.19 140)",
    }
    return colors[category] || colors.idea
  }

  return (
    <Card className="glass p-6 h-[calc(100vh-16rem)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Thought
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Add New Thought</DialogTitle>
                <DialogDescription>Capture a new thought and categorize it for your mind map</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Input
                    id="content"
                    value={newThought.content}
                    onChange={(e) => setNewThought({ ...newThought, content: e.target.value })}
                    placeholder="What's on your mind?"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newThought.category}
                    onValueChange={(v) => setNewThought({ ...newThought, category: v })}
                  >
                    <SelectTrigger id="category" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addThought} className="w-full">
                  Add Thought
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {selectedNode && (
            <>
              <Button
                variant="outline"
                onClick={() => startConnecting(selectedNode)}
                className="gap-2"
                disabled={!!connectingFrom}
              >
                <Link2 className="w-4 h-4" />
                {connectingFrom ? "Click target..." : "Connect"}
              </Button>
              <Button variant="destructive" onClick={deleteSelectedNode} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {connectingFrom ? "Click another thought to connect" : "Drag to move • Click to select"}
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative h-full rounded-lg overflow-hidden border border-border/30 bg-background/20"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {thoughts.map((thought) =>
            thought.connections.map((targetId) => {
              const target = thoughts.find((t) => t.id === targetId)
              if (!target) return null

              return (
                <line
                  key={`${thought.id}-${targetId}`}
                  x1={thought.x + 100}
                  y1={thought.y + 40}
                  x2={target.x + 100}
                  y2={target.y + 40}
                  stroke={getCategoryColor(thought.category)}
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  strokeDasharray="5,5"
                />
              )
            }),
          )}
        </svg>

        {/* Thought nodes */}
        {thoughts.map((thought) => (
          <div
            key={thought.id}
            className={`absolute cursor-move select-none transition-shadow ${
              selectedNode === thought.id ? "ring-2 ring-primary" : ""
            } ${connectingFrom === thought.id ? "ring-2 ring-accent" : ""}`}
            style={{
              left: thought.x,
              top: thought.y,
              width: 200,
            }}
            onMouseDown={(e) => handleNodeMouseDown(e, thought.id)}
            onClick={() => {
              if (connectingFrom) {
                finishConnecting(thought.id)
              }
            }}
          >
            <div
              className="glass-strong p-4 rounded-xl border-2 hover:shadow-lg transition-all"
              style={{
                borderColor: getCategoryColor(thought.category),
              }}
            >
              <div
                className="text-xs font-semibold mb-2 uppercase tracking-wide"
                style={{ color: getCategoryColor(thought.category) }}
              >
                {thought.category}
              </div>
              <div className="text-sm text-foreground leading-relaxed">
                {thought.content.length > 80 ? `${thought.content.slice(0, 80)}...` : thought.content}
              </div>
            </div>
          </div>
        ))}

        {thoughts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              No thoughts yet. Click "Add Thought" to start mapping your mind.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
