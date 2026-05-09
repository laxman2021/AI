import { useState } from 'react'
import API from '../api/api'
import { Upload } from 'lucide-react'

export default function UploadDataset({ setDatasetId }) {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    if (!file) {
      alert('Select CSV file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await API.post('/upload', formData)

      setDatasetId(response.data.dataset_id)

      setMessage(
        `Dataset uploaded successfully. Dataset ID: ${response.data.dataset_id}`
      )
    } catch (error) {
      console.log(error)
      setMessage('Upload failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Upload size={28} />
        <h2 className="text-2xl font-bold">Upload Dataset</h2>
      </div>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Upload
      </button>

      {message && (
        <p className="mt-4 text-green-600 font-semibold">
          {message}
        </p>
      )}
    </div>
  )
}