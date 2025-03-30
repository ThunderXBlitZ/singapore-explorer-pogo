"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import GameControls from "./game-controls"
import GameStats from "./game-stats"
import GameOver from "./game-over"
import { Creature, PokeStop, HighScore } from "../types/game-types"

// Dynamically import the map component to avoid SSR issues with Leaflet
const GameMap = dynamic(() => import("./game-map"), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">Loading map...</div>,
})

export default function GameContainer() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [energy, setEnergy] = useState(100)
  const [score, setScore] = useState(0)
  const [playerPosition, setPlayerPosition] = useState<[number, number]>([1.3521, 103.8198]) // Singapore coordinates
  const [creatures, setCreatures] = useState<Creature[]>([])
  const [pokeStops, setPokeStops] = useState<PokeStop[]>([])
  const [highScores, setHighScores] = useState<HighScore[]>([])

  // Generate random creatures and PokeStops when the game starts
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Generate random creatures around Singapore
      const newCreatures = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        position: [
          1.3521 + (Math.random() - 0.5) * 0.02, 
          103.8198 + (Math.random() - 0.5) * 0.02
        ] as [number, number],
        type: ["normal", "rare", "epic", "legendary"][Math.floor(Math.random() * 4)] as Creature["type"],
        points: [10, 30, 50, 100][Math.floor(Math.random() * 4)],
        caught: false,
      }))
      setCreatures(newCreatures)

      // Generate random PokeStops around Singapore
      const newPokeStops = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        position: [
          1.3521 + (Math.random() - 0.5) * 0.015, 
          103.8198 + (Math.random() - 0.5) * 0.015
        ] as [number, number],
        activated: false,
      }))
      setPokeStops(newPokeStops)

      // Start the timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameStarted, gameOver])

  // Move player based on direction
  const movePlayer = (direction: string) => {
    const step = 0.0008 // Movement step size

    setPlayerPosition((prev) => {
      const [lat, lng] = prev

      switch (direction) {
        case "up":
          return [lat + step, lng] as [number, number]
        case "down":
          return [lat - step, lng] as [number, number]
        case "left":
          return [lat, lng - step] as [number, number]
        case "right":
          return [lat, lng + step] as [number, number]
        default:
          return prev
      }
    })
  }

  // Check for creature captures and PokeStop activations
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Check for nearby creatures
      const updatedCreatures = creatures.map((creature) => {
        if (!creature.caught) {
          const distance = calculateDistance(
            playerPosition[0],
            playerPosition[1],
            (creature.position as [number, number])[0],
            (creature.position as [number, number])[1],
          )

          // If player is close enough to a creature and has energy
          if (distance < 0.0005 && energy >= 20) {
            setEnergy((prev) => prev - 20) // Use energy to catch
            setScore((prev) => prev + creature.points)
            return { ...creature, caught: true }
          }
        }
        return creature
      })

      if (JSON.stringify(updatedCreatures) !== JSON.stringify(creatures)) {
        setCreatures(updatedCreatures)
      }

      // Check for nearby PokeStops
      const updatedPokeStops = pokeStops.map((stop) => {
        if (!stop.activated) {
          const distance = calculateDistance(
            playerPosition[0], 
            playerPosition[1], 
            (stop.position as [number, number])[0], 
            (stop.position as [number, number])[1]
          )

          // If player is close enough to a PokeStop
          if (distance < 0.0005) {
            setEnergy((prev) => Math.min(prev + 50, 100)) // Refill energy
            return { ...stop, activated: true }
          }
        }
        return stop
      })

      if (JSON.stringify(updatedPokeStops) !== JSON.stringify(pokeStops)) {
        setPokeStops(updatedPokeStops)
      }
    }
  }, [playerPosition, gameStarted, gameOver, creatures, pokeStops, energy])

  // Calculate distance between two coordinates (simplified)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2))
  }

  // Start a new game
  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setTimeLeft(120)
    setEnergy(100)
    setScore(0)
    setPlayerPosition([1.3521, 103.8198])
  }

  // Save score when game is over
  useEffect(() => {
    if (gameOver && score > 0) {
      const newHighScores = [...highScores, { score, date: new Date().toISOString() }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      setHighScores(newHighScores)
    }
  }, [gameOver, score, highScores])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!gameStarted ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Welcome to Singapore Explorer!</h2>
          <p className="mb-6">
            Explore Singapore, catch creatures, and activate PokeStops to refill your energy. You have 2 minutes to
            score as many points as possible!
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        <GameOver score={score} highScores={highScores} onRestart={startGame} />
      ) : (
        <>
          <GameStats timeLeft={timeLeft} energy={energy} score={score} />
          <div className="relative w-full h-[500px] border-4 border-blue-500 rounded-lg overflow-hidden">
            <GameMap playerPosition={playerPosition} creatures={creatures} pokeStops={pokeStops} />
          </div>
          <GameControls onMove={movePlayer} />
        </>
      )}
    </div>
  )
}
