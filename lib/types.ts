// Author: MANZI RURANGIRWA Elvis

export interface Thought {
  id: string
  content: string
  category: "idea" | "task" | "note" | "goal"
  priority: "low" | "medium" | "high"
  connections: string[] // IDs of connected thoughts
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface Emotion {
  id: string
  type: "joy" | "sadness" | "anger" | "fear" | "surprise" | "neutral"
  intensity: number // 1-10
  note?: string
  timestamp: Date
  triggers?: string[]
}

export interface MentalSync {
  id: string
  date: Date
  mood: number // 1-10
  energy: number // 1-10
  focus: number // 1-10
  gratitude: string[]
  intentions: string[]
  reflections: string
  completed: boolean
}

export interface Widget {
  id: string
  type: "thought-count" | "emotion-tracker" | "focus-timer" | "quick-note" | "daily-quote"
  position: { x: number; y: number }
  size: { width: number; height: number }
  visible: boolean
}

export interface LifeOSData {
  thoughts: Thought[]
  emotions: Emotion[]
  syncs: MentalSync[]
  widgets: Widget[]
  settings: {
    theme: "dark" | "light"
    notifications: boolean
    syncReminder: boolean
    syncTime: string
  }
}
