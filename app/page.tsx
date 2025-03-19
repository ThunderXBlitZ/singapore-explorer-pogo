import GameContainer from "@/components/game-container"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Singapore Explorer</h1>
      <GameContainer />
    </main>
  )
}

