import { useState, useRef, useCallback } from 'react'

type BrowserSpeechRecognitionEvent = Event & {
  results: { [index: number]: { [index: number]: { transcript: string } } }
}

type BrowserSpeechRecognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition

type SpeechWindow = Window & typeof globalThis & {
  SpeechRecognition?: BrowserSpeechRecognitionCtor
  webkitSpeechRecognition?: BrowserSpeechRecognitionCtor
}

export function useVoice(onTranscript: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<BrowserSpeechRecognition | null>(null)

  const start = useCallback(() => {
    const speechWindow = window as SpeechWindow
    const SR = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onresult = (e: BrowserSpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript
      onTranscript(text)
    }
    rec.onend = () => setListening(false)
    rec.start()
    recRef.current = rec
    setListening(true)
  }, [onTranscript])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, start, stop }
}
