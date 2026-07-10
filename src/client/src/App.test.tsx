import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import App from './App'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('App Component (UI / UX Tests)', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('renders initial view with uppercase title, dropzone, and floating legend', () => {
    render(<App />)
    expect(screen.getByText('OPTIMAL WORD COUNTER')).toBeInTheDocument()
    expect(screen.getByText('Drag & drop your file here')).toBeInTheDocument()
    expect(screen.getByText(/Increase or decrease the amount as you wish/i)).toBeInTheDocument()
    
    // Check that placeholder common words are rendered
    expect(screen.getByText('results')).toBeInTheDocument()
    expect(screen.getByText('will')).toBeInTheDocument()
    expect(screen.getByText('be')).toBeInTheDocument()
  })

  it('allows file selection via drag and drop', () => {
    render(<App />)
    const dropzone = screen.getByText('Drag & drop your file here').closest('.dropzone')
    expect(dropzone).toBeInTheDocument()

    const file = new File(['hello world hello'], 'test.txt', { type: 'text/plain' })

    // Simulate drop event
    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [file]
      }
    })

    // Should now show file details card
    expect(screen.getByText('test.txt')).toBeInTheDocument()
    expect(screen.getByText(/0.02 KB/i)).toBeInTheDocument()
  })

  it('allows changing the top limit via keyboard and mouse wheel on interactive span', () => {
    render(<App />)
    const numSpan = screen.getByTestId('interactive-num')
    expect(numSpan.textContent).toBe('10')

    // Test ArrowUp key
    fireEvent.keyDown(numSpan, { key: 'ArrowUp' })
    expect(numSpan.textContent).toBe('11')

    // Test ArrowDown key
    fireEvent.keyDown(numSpan, { key: 'ArrowDown' })
    expect(numSpan.textContent).toBe('10')

    // Test typing digits directly: Focus and type "5"
    fireEvent.keyDown(numSpan, { key: '5' })
    expect(numSpan.textContent).toBe('5')

    // Type "0" to make it "50"
    fireEvent.keyDown(numSpan, { key: '0' })
    expect(numSpan.textContent).toBe('50')

    // Test Backspace
    fireEvent.keyDown(numSpan, { key: 'Backspace' })
    expect(numSpan.textContent).toBe('5')

    // Test mouse wheel event
    // deltaY > 0 decrements
    fireEvent.wheel(numSpan, { deltaY: 100 })
    expect(numSpan.textContent).toBe('4')

    // deltaY < 0 increments
    fireEvent.wheel(numSpan, { deltaY: -100 })
    expect(numSpan.textContent).toBe('5')
  })

  it('runs analysis and shows scrutinized words in notebook-style cards', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        frecuencies: [
          { word: 'hello', count: 12 },
          { word: 'world', count: 8 }
        ]
      })
    })

    render(<App />)
    
    // Select file
    const dropzone = screen.getByText('Drag & drop your file here').closest('.dropzone')
    const file = new File(['hello world'], 'doc.txt', { type: 'text/plain' })
    fireEvent.drop(dropzone!, {
      dataTransfer: { files: [file] }
    })

    // Click Analyze
    const submitBtn = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitBtn)

    // Should disable submit check button during load
    expect(submitBtn).toBeDisabled()

    // Wait for results to be rendered by checking for the analyzed word card
    await waitFor(() => {
      expect(screen.getByText('hello')).toBeInTheDocument()
    })

    // Verify word and count cards
    expect(screen.getByText('#12')).toBeInTheDocument()
    expect(screen.getByText('world')).toBeInTheDocument()
    expect(screen.getByText('#8')).toBeInTheDocument()
  })

  it('displays error alerts when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      json: async () => ({ message: "File not supported" })
    })

    render(<App />)

    // Select file
    const dropzone = screen.getByText('Drag & drop your file here').closest('.dropzone')
    const file = new File(['hello'], 'doc.txt', { type: 'text/plain' })
    fireEvent.drop(dropzone!, {
      dataTransfer: { files: [file] }
    })

    // Click Analyze
    const submitBtn = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitBtn)

    // Wait for error alert
    await waitFor(() => {
      expect(screen.getByText('File not supported')).toBeInTheDocument()
    })
  })

  it('allows removing the selected file to start over', () => {
    render(<App />)
    const dropzone = screen.getByText('Drag & drop your file here').closest('.dropzone')
    const file = new File(['text'], 'demo.txt', { type: 'text/plain' })
    
    fireEvent.drop(dropzone!, {
      dataTransfer: { files: [file] }
    })

    expect(screen.getByText('demo.txt')).toBeInTheDocument()

    // Click remove button
    const removeBtn = screen.getByRole('button', { name: /remove file/i })
    fireEvent.click(removeBtn)

    // Should return to dropzone
    expect(screen.getByText('Drag & drop your file here')).toBeInTheDocument()
    expect(screen.queryByText('demo.txt')).not.toBeInTheDocument()
  })
})
