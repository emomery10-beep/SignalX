// Web Speech API type declarations (not in default TypeScript lib)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

interface UseVoiceOptions {
  onTranscript: (text: string) => void
  onFinalTranscript: (text: string) => void
  silenceTimeoutMs?: number
}

export interface VoiceState {
  isRecording: boolean
  isProcessing: boolean
  transcript: string
  analyserNode: AnalyserNode | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  error: string | null
}

export function useVoice({ onTranscript, onFinalTranscript, silenceTimeoutMs = 2000 }: UseVoiceOptions): VoiceState {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finalTranscriptRef = useRef('')
  const streamRef = useRef<MediaStream | null>(null)
  const isRecordingRef = useRef(false)

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null }
  }

  const stopRecording = useCallback(() => {
    clearSilenceTimer()
    isRecordingRef.current = false
    if (recognitionRef.current) { try { recognitionRef.current.stop() } catch (_) {}; recognitionRef.current = null }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
    setAnalyserNode(null)
    setIsRecording(false)
    setIsProcessing(false)
    setTranscript('')
    finalTranscriptRef.current = ''
  }, [])

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioContextClass()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      setAnalyserNode(analyser)

      const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognitionAPI) {
        setError('Voice input requires Chrome or Edge')
        stopRecording()
        return
      }

      const recognition = new SpeechRecognitionAPI()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-GB'
      recognitionRef.current = recognition

      const resetTimer = () => {
        clearSilenceTimer()
        silenceTimerRef.current = setTimeout(() => {
          const text = finalTranscriptRef.current.trim()
          if (text) {
            onFinalTranscript(text)
            finalTranscriptRef.current = ''
            setTranscript('')
          }
        }, silenceTimeoutMs)
      }

      recognition.onresult = (event: any) => {
        let interim = '', final = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript
          else interim += event.results[i][0].transcript
        }
        if (final) finalTranscriptRef.current = (finalTranscriptRef.current + ' ' + final).trim()
        const display = (finalTranscriptRef.current + ' ' + interim).trim()
        setTranscript(display)
        onTranscript(display)
        if (interim || final) resetTimer()
      }

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          setError(`Mic error: ${event.error}`)
          stopRecording()
        }
      }

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try { recognition.start() } catch (_) {}
        }
      }

      isRecordingRef.current = true
      recognition.start()
      setIsRecording(true)
      resetTimer()

    } catch {
      setError('Microphone access denied. Please allow mic in browser settings.')
      stopRecording()
    }
  }, [onTranscript, onFinalTranscript, silenceTimeoutMs, stopRecording])

  useEffect(() => () => stopRecording(), [stopRecording])

  return { isRecording, isProcessing, transcript, analyserNode, startRecording, stopRecording, error }
}
