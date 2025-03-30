interface GameStatsProps {
  timeLeft: number;
  energy: number;
  score: number;
}

export default function GameStats({ timeLeft, energy, score }: GameStatsProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-2 sm:mb-0">
        <div className="text-gray-700 font-medium">Time: </div>
        <div className="ml-2 font-bold text-lg">{formatTime(timeLeft)}</div>
      </div>

      <div className="flex items-center mb-2 sm:mb-0">
        <div className="text-gray-700 font-medium">Energy: </div>
        <div className="ml-2 w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${energy > 60 ? "bg-green-500" : energy > 30 ? "bg-yellow-500" : "bg-red-500"}`}
            style={{ width: `${energy}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-gray-700 font-medium">Score: </div>
        <div className="ml-2 font-bold text-lg">{score}</div>
      </div>
    </div>
  )
}
