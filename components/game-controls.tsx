"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

type Direction = "up" | "down" | "left" | "right"

interface GameControlsProps {
  onMove: (direction: Direction) => void
}

export default function GameControls({ onMove }: GameControlsProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        e.preventDefault()
        setPressedKeys((prev) => new Set(prev).add(key))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        setPressedKeys((prev) => {
          const newKeys = new Set(prev)
          newKeys.delete(key)
          return newKeys
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Process movement based on pressed keys
  useEffect(() => {
    if (pressedKeys.size === 0) return

    const moveInterval = setInterval(() => {
      if (pressedKeys.has("arrowup") || pressedKeys.has("w")) {
        onMove("up")
      }
      if (pressedKeys.has("arrowdown") || pressedKeys.has("s")) {
        onMove("down")
      }
      if (pressedKeys.has("arrowleft") || pressedKeys.has("a")) {
        onMove("left")
      }
      if (pressedKeys.has("arrowright") || pressedKeys.has("d")) {
        onMove("right")
      }
    }, 100)

    return () => clearInterval(moveInterval)
  }, [pressedKeys, onMove])

  // Handle button clicks for mobile
  const handleButtonDown = (direction: string) => {
    setPressedKeys((prev) => new Set(prev).add(direction))
  }

  const handleButtonUp = (direction: string) => {
    setPressedKeys((prev) => {
      const newKeys = new Set(prev)
      newKeys.delete(direction)
      return newKeys
    })
  }

  return (
    <div className="mt-4 flex flex-col items-center">
      <p className="mb-2 text-sm text-gray-600">Use arrow keys or WASD to move, or tap/hold the buttons below</p>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-start-2">
          <button
            className={`w-16 h-16 flex items-center justify-center rounded-full ${
              pressedKeys.has("arrowup") || pressedKeys.has("w") ? "bg-blue-600" : "bg-blue-500"
            } text-white`}
            onMouseDown={() => handleButtonDown("arrowup")}
            onMouseUp={() => handleButtonUp("arrowup")}
            onTouchStart={() => handleButtonDown("arrowup")}
            onTouchEnd={() => handleButtonUp("arrowup")}
            aria-label="Move up"
          >
            <ArrowUp size={24} />
          </button>
        </div>

        <div className="col-start-1 row-start-2">
          <button
            className={`w-16 h-16 flex items-center justify-center rounded-full ${
              pressedKeys.has("arrowleft") || pressedKeys.has("a") ? "bg-blue-600" : "bg-blue-500"
            } text-white`}
            onMouseDown={() => handleButtonDown("arrowleft")}
            onMouseUp={() => handleButtonUp("arrowleft")}
            onTouchStart={() => handleButtonDown("arrowleft")}
            onTouchEnd={() => handleButtonUp("arrowleft")}
            aria-label="Move left"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="col-start-2 row-start-2">
          <button
            className={`w-16 h-16 flex items-center justify-center rounded-full ${
              pressedKeys.has("arrowdown") || pressedKeys.has("s") ? "bg-blue-600" : "bg-blue-500"
            } text-white`}
            onMouseDown={() => handleButtonDown("arrowdown")}
            onMouseUp={() => handleButtonUp("arrowdown")}
            onTouchStart={() => handleButtonDown("arrowdown")}
            onTouchEnd={() => handleButtonUp("arrowdown")}
            aria-label="Move down"
          >
            <ArrowDown size={24} />
          </button>
        </div>

        <div className="col-start-3 row-start-2">
          <button
            className={`w-16 h-16 flex items-center justify-center rounded-full ${
              pressedKeys.has("arrowright") || pressedKeys.has("d") ? "bg-blue-600" : "bg-blue-500"
            } text-white`}
            onMouseDown={() => handleButtonDown("arrowright")}
            onMouseUp={() => handleButtonUp("arrowright")}
            onTouchStart={() => handleButtonDown("arrowright")}
            onTouchEnd={() => handleButtonUp("arrowright")}
            aria-label="Move right"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
