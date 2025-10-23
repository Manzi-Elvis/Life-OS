// Author: MANZI RURANGIRWA Elvis

import type { LifeOSData, Thought, Emotion, MentalSync } from "./types"

const STORAGE_KEY = "lifeos_data"

const defaultData: LifeOSData = {
  thoughts: [],
  emotions: [],
  syncs: [],
  widgets: [
    {
      id: "widget-1",
      type: "thought-count",
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
      visible: true,
    },
    {
      id: "widget-2",
      type: "emotion-tracker",
      position: { x: 1, y: 0 },
      size: { width: 1, height: 1 },
      visible: true,
    },
    {
      id: "widget-3",
      type: "focus-timer",
      position: { x: 2, y: 0 },
      size: { width: 1, height: 1 },
      visible: true,
    },
  ],
  settings: {
    theme: "dark",
    notifications: true,
    syncReminder: true,
    syncTime: "09:00",
  },
}

export const loadData = (): LifeOSData => {
  if (typeof window === "undefined") return defaultData

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultData

    const parsed = JSON.parse(stored)
    // Convert date strings back to Date objects
    parsed.emotions =
      parsed.emotions?.map((e: Emotion) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      })) || []
    parsed.syncs =
      parsed.syncs?.map((s: MentalSync) => ({
        ...s,
        date: new Date(s.date),
      })) || []
    parsed.thoughts =
      parsed.thoughts?.map((t: Thought) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      })) || []

    return { ...defaultData, ...parsed }
  } catch (error) {
    console.error("[LifeOS] Error loading data:", error)
    return defaultData
  }
}

export const saveData = (data: LifeOSData): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("[LifeOS] Error saving data:", error)
  }
}

export const addThought = (data: LifeOSData, thought: Omit<Thought, "id" | "createdAt" | "updatedAt">): LifeOSData => {
  const newThought: Thought = {
    ...thought,
    id: `thought-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const updated = {
    ...data,
    thoughts: [...data.thoughts, newThought],
  }

  saveData(updated)
  return updated
}

export const addEmotion = (data: LifeOSData, emotion: Omit<Emotion, "id" | "timestamp">): LifeOSData => {
  const newEmotion: Emotion = {
    ...emotion,
    id: `emotion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  }

  const updated = {
    ...data,
    emotions: [...data.emotions, newEmotion],
  }

  saveData(updated)
  return updated
}

export const addSync = (data: LifeOSData, sync: Omit<MentalSync, "id" | "date">): LifeOSData => {
  const newSync: MentalSync = {
    ...sync,
    id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
  }

  const updated = {
    ...data,
    syncs: [...data.syncs, newSync],
  }

  saveData(updated)
  return updated
}

export const updateThought = (data: LifeOSData, id: string, updates: Partial<Thought>): LifeOSData => {
  const updated = {
    ...data,
    thoughts: data.thoughts.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)),
  }

  saveData(updated)
  return updated
}

export const deleteThought = (data: LifeOSData, id: string): LifeOSData => {
  const updated = {
    ...data,
    thoughts: data.thoughts.filter((t) => t.id !== id),
  }

  saveData(updated)
  return updated
}
