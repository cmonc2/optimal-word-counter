import React, { DragEvent, ChangeEvent } from 'react'

interface DropzoneProps {
  file: File | null;
  dragActive: boolean;
  loading: boolean;
  handleDrag: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  submitFile: () => void;
  removeFile: () => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  file,
  dragActive,
  loading,
  handleDrag,
  handleDrop,
  handleFileChange,
  submitFile,
  removeFile
}) => {
  return (
    <div className="dropzone-wrapper">
      {!file ? (
        <div
          className={`dropzone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileChange}
            className="file-input-hidden"
          />
          <label htmlFor="file-upload" className="dropzone-label">
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="upload-text-main">Drag & drop your file here</span>
            <span className="upload-text-sub">or click to browse</span>
          </label>
        </div>
      ) : (
        <div className="file-card">
          <div className="file-info">
            <div className="file-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="file-meta">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
            </div>
          </div>
          <div className="file-actions">
            <button 
              className="submit-check-btn" 
              onClick={submitFile} 
              disabled={loading}
              title="Submit"
              aria-label="Submit"
            >
              {loading ? (
                <span className="mini-spinner"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <button 
              className="remove-btn" 
              onClick={removeFile} 
              title="Remove file" 
              aria-label="Remove file"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
