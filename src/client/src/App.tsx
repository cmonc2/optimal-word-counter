import { useState, DragEvent, ChangeEvent } from 'react'
import { WordLimitSelector } from './components/WordLimitSelector'
import { Dropzone } from './components/Dropzone'
import './App.css'

interface FrequencyItem {
  word: string;
  count: number;
}

interface ResultData {
  frecuencies: FrequencyItem[];
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [top, setTop] = useState<number>(10)
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [dragActive, setDragActive] = useState<boolean>(false)

  // Drag and drop handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/plain" || droppedFile.name.endsWith(".txt")) {
        setFile(droppedFile)
        setError("")
      } else {
        setError("Only .txt files are supported")
      }
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const removeFile = () => {
    setFile(null)
    setResult(null)
    setError("")
  }

  const submitFile = () => {
    if (!file) {
      setError("Please select a file first")
      return
    }
    if (top < 1) {
      setError("Please enter a number greater than 0")
      return
    }

    setError("")
    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    fetch(`/api/v1/upload/${top}`, {
      method: 'POST',
      body: formData
    })
      .then(async response => {
        if (response.status === 413) {
          throw new Error('File is too large for processing (maximum allowed size is 4.5 MB).')
        }
        if (response.status === 404) {
          throw new Error('Upload endpoint not found (HTTP 404).')
        }

        const rawText = await response.text()
        let data: any
        try {
          data = JSON.parse(rawText)
        } catch {
          throw new Error(rawText ? `Server returned: ${rawText.slice(0, 150)}` : `Server error (HTTP ${response.status})`)
        }

        if (!response.ok || !data) {
          throw new Error(data?.message || 'An error occurred while analyzing the file.')
        }
        return data
      })
      .then(data => {
        setResult(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || "Error connecting to server")
        setLoading(false)
      })
  }

  // Pre-configured results placeholders
  const placeholderFrequencies = [
    { word: "results", count: 88 },
    { word: "will", count: 45 },
    { word: "be", count: 32 },
    { word: "shown", count: 28 },
    { word: "here", count: 12 },
  ]

  // Slice placeholders dynamically to respond to top state
  const activePlaceholders = placeholderFrequencies.slice(0, top)

  return (
    <div className="app-container">
      <div className="glass-card">
        <header className="app-header">
          <h1 className="title">OPTIMAL WORD COUNTER</h1>
          <p className="subtitle">
            Upload a <span className="highlight-txt">.txt</span> file and highlight the top <WordLimitSelector top={top} setTop={setTop} /> most frequent words.
          </p>
        </header>

        {/* SVG Curved Arrows */}
        <div className="arrows-container">
          <svg className="svg-arrows" viewBox="0 0 600 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-color)" />
              </marker>
            </defs>
            {/* Arrow 1: pointing from the .txt span area down to the dropzone on the left */}
            <path d="M 129 -3 Q 127 59 40 11 Q -31 -20 -38 43" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
            {/* Arrow 2: pointing from the number span area down to the floating legend on the right */}
            <path d="M 356 -9 Q 293 21 379 46" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
          </svg>
        </div>

        <main className="app-content">
          <div className="main-row">
            <div className="row-left">
              <Dropzone
                file={file}
                dragActive={dragActive}
                loading={loading}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                handleFileChange={handleFileChange}
                submitFile={submitFile}
                removeFile={removeFile}
              />
            </div>

            <div className="row-right">
              {/* Floating Legend / Speech Bubble */}
              <div className="floating-legend">
                <p>Increase or decrease the amount as you wish (Scroll, Arrow keys ↑↓ or type directly on the number)</p>
              </div>
              <div className="floating-legend">
                <p>Use the buttons to proceed or cancel (buttons will appear after uploading the file)</p>
              </div>
            </div>
          </div>

          {/* Alert Message */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          ) || (
            <div className="error-alert-placeholder"></div>
          )}

          {/* Results Section */}
          <div className="results-container">
            {loading && (
              <div className="skeleton-flex">
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
              </div>
            )}

            {!loading && (
              <div className="results-wrapper">
                {result && result.frecuencies.length === 0 ? (
                  <p className="no-data">No words found in this file.</p>
                ) : (
                  <div className="notebook-flex">
                    {(result ? result.frecuencies : activePlaceholders).map((item, index) => {
                      const rank = index + 1
                      let rankClass = ""
                      if (rank === 1) rankClass = "rank-gold"
                      else if (rank === 2) rankClass = "rank-silver"
                      else if (rank === 3) rankClass = "rank-bronze"

                      return (
                        <div key={index} className={`notebook-card ${!result ? 'placeholder-card' : ''} ${rankClass}`}>
                          <div className="notebook-header">
                            <span className="notebook-count">#{item.count}</span>
                          </div>
                          <div className="notebook-word-wrapper">
                            <span className="word-text" title={result ? item.word : undefined}>
                              {item.word}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
