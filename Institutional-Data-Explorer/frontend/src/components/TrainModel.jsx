import { useState } from 'react'
import API from '../api/api'
import { Brain } from 'lucide-react'

export default function TrainModel({ datasetId }) {
  const [target, setTarget] = useState('result')
  const [result, setResult] = useState(null)

  const trainModel = async () => {
    if (!datasetId) {
      alert('Upload dataset first')
      return
    }

    try {
      const response = await API.post(
        `/ai/train/${datasetId}?target=${target}`
      )

      setResult(response.data)
    } catch (error) {
      console.log(error)
      alert('Training failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Brain size={28} />
        <h2 className="text-2xl font-bold">Train Model</h2>
      </div>

      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Target column"
        className="border p-2 rounded-lg w-full mb-4"
      />

      <button
        onClick={trainModel}
        className="bg-green-600 text-white px-5 py-2 rounded-lg"
      >
        Train
      </button>

      {result && (
        <div className="mt-4 text-lg font-semibold text-green-700">
          Accuracy: {result.accuracy}%
        </div>
      )}
    </div>
  )
}