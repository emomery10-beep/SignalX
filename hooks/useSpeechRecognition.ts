// Web Speech API type declarations (not in default TypeScript lib)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognition = any
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

'use client'
import { useState, useRef, useCallback, useMemo, useEffect } from 'react'

export interface UseSpeechRecognitionResult {
  startListening: () => void
  stopListening: () => void
  transcript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
}

export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(false)

  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') return false
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  }, [])

  const stopListening = useCallback(() => {
    isListeningRef.current = false
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (_) {}
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    setError(null)
    setTranscript('')

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setError('Voice input is not supported in this browser')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript
        else interim += event.results[i][0].transcript
      }
      setTranscript((final || interim).trim())
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError('Microphone access denied. Please allow mic access in browser settings.')
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setError(`Speech recognition error: ${event.error}`)
      }
      isListeningRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      isListeningRef.current = false
      setIsListening(false)
    }

    try {
      isListeningRef.current = true
      recognition.start()
      setIsListening(true)
    } catch {
      setError('Unable to start voice recognition')
      isListeningRef.current = false
      setIsListening(false)
    }
  }, [])

  useEffect(() => () => stopListening(), [stopListening])

  return { startListening, stopListening, transcript, isListening, isSupported, error }
}
