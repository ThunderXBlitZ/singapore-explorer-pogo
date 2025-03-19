"use client"

export default function GameOver({ score, highScores, onRestart }) {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
      <p className="text-xl mb-6">
        Your score: <span className="font-bold">{score}</span>
      </p>

      {highScores.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">High Scores</h3>
          <ul className="space-y-1">
            {highScores.map((entry, index) => (
              <li key={index} className="flex justify-between max-w-xs mx-auto">
                <span>#{index + 1}</span>
                <span className="font-medium">{entry.score}</span>
                <span className="text-gray-500 text-sm">{new Date(entry.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onRestart}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Play Again
      </button>
    </div>
  )
}

