import { useState } from 'react'
import API from '../api/api'
import { Sparkles } from 'lucide-react'

export default function PredictForm() {
  const [age, setAge] = useState('')
  const [attendance, setAttendance] = useState('')
  const [marks, setMarks] = useState('')
  const [prediction, setPrediction] = useState('')

  const makePrediction = async () => {
    try {
      const response = await API.post('/ai/predict', {
        age: Number(age),
        attendance: Number(attendance),
        marks: Number(marks),
      })

      setPrediction(response.data.prediction)
    } catch (error) {
      console.log(error)
      alert('Prediction failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles size={28} />
        <h2 className="text-2xl font-bold">Make Prediction</h2>
      </div>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="number"
          placeholder="Attendance"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
      </div>

      <button
        onClick={makePrediction}
        className="bg-purple-600 text-white px-5 py-2 rounded-lg mt-5"
      >
        Predict
      </button>

      {prediction && (
        <div className="mt-5 text-2xl font-bold text-blue-700">
          Prediction: {prediction}
        </div>
      )}
    </div>
  )
}