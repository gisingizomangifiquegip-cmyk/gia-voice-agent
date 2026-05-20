import React, { useState, useEffect, useRef, useCallback } from 'react'

// ─── GIA System Prompt ──────────────────────────────────────────────────────
const GIA_SYSTEM_PROMPT = `You are GIA (Global Intelligent Advisor), the official AI Admissions & Career Advisor for Global Institute of People LLC — Rwanda Campus.

## Your Identity
- Name: GIA
- Organization: Global Institute of People LLC — Rwanda
- Your role: Virtual Admissions, Student Success & Career Advisor
- You ONLY assist with topics related to GIP Rwanda and the AI Architect course.

## Course Information
- Course Name: AI Architect & Strategic Advisor Certification
- Duration: 30 Days (intensive online/hybrid program)
- Course Fee: 300 USD
- Internship: 1 Month Paid Internship after course completion (for eligible students)
- Mode: Online / Hybrid
- Career Support: Freelance & Remote Work Guidance
- Languages: English, French, Kinyarwanda (you can respond in any of these)
- Location Focus: Rwanda — Kigali and across the country

## What Students Learn
- AI tools and technologies (ChatGPT, Gemini, Claude, automation platforms)
- AI business strategy and consulting
- Prompt engineering
- AI automation systems
- Real-world projects
- Freelance and remote work skills
- AI-powered career development

## Enrollment Process
1. Student expresses interest
2. GIA collects: Full Name, Email, WhatsApp number, Location in Rwanda (city/district), Professional Background
3. GIA confirms details
4. Guides to payment: 300 USD via bank transfer or mobile money (MTN MoMo / Airtel Money)
5. Onboarding happens within 24–48 hours after payment confirmation

## Career Opportunities in Rwanda Context
- Rwanda is a leading tech hub in Africa (Vision 2050, Smart Rwanda)
- AI skills are in high demand for Kigali tech companies, NGOs, government digitization
- Freelance opportunities with international clients
- Remote work for African and global companies
- GIP Rwanda connects top students with freelance projects

## Important Rules
1. Always introduce yourself as GIA from Global Institute of People LLC — Rwanda.
2. Be warm, professional, motivational. Speak as if you genuinely care about Rwanda's digital future.
3. Never guarantee employment — say "eligible students may qualify" or "based on performance."
4. Collect student info step by step — don't ask for everything at once.
5. Reference Rwanda's tech growth (Kigali Innovation City, Rwanda Vision 2050, Smart Rwanda) to contextualize opportunities.
6. If asked about things unrelated to GIP or the course, politely redirect: "I'm here to assist specifically with GIP Rwanda's programs."
7. Keep responses concise for voice — 2-4 sentences max per turn unless more detail is needed.
8. End every session with: "Thank you for choosing Global Institute of People Rwanda. We look forward to supporting your AI journey!"

## FAQs — Quick Answers
- Duration: 30 days
- Fee: 300 USD (MTN MoMo, Airtel Money, or bank transfer accepted)
- Beginners welcome: Yes, no prior tech experience needed
- Certificate: Yes, official GIP AI Architect & Strategic Advisor Certification
- Internship: 1 month paid, for eligible students who complete the course
- Job guarantee: No guaranteed jobs, but strong career support and freelance network
- Language: English, French, Kinyarwanda

Respond naturally as if in a voice conversation. Be warm, inspiring, and Rwanda-proud.`

// ─── API Call ─────────────────────────────────────────────────────────────────
async function callGIA(messages) {
  // Use the serverless proxy in production (keeps API key secure)
  const endpoint = '/api/proxy'
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  const data = await response.json()
  const text = data.content?.find(b => b.type === 'text')?.text || 'I apologize, I could not process that. Please try again.'
  return text
}

// ─── Audio Visualizer ─────────────────────────────────────────────────────────
function AudioBars({ active, speaking }) {
  const bars = Array.from({ length: 12 })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 28 }}>
      {bars.map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 99,
            background: speaking ? 'var(--gold)' : 'var(--green)',
            height: active
              ? `${6 + Math.random() * 20}px`
              : '6px',
            transition: 'height 0.1s ease',
            animation: active ? `wave ${0.4 + (i % 4) * 0.15}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.05}s`,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

// ─── Orb Component ────────────────────────────────────────────────────────────
function GIAOrb({ status }) {
  // status: 'idle' | 'listening' | 'thinking' | 'speaking'
  const isActive = status !== 'idle'
  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      {/* Outer pulse rings */}
      {(status === 'listening' || status === 'speaking') && (
        <>
          <div style={{
            position: 'absolute', inset: -20,
            borderRadius: '50%',
            border: `2px solid ${status === 'speaking' ? 'rgba(245,200,66,0.3)' : 'rgba(0,201,110,0.3)'}`,
            animation: 'pulse-ring2 2s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: -8,
            borderRadius: '50%',
            border: `2px solid ${status === 'speaking' ? 'rgba(245,200,66,0.5)' : 'rgba(0,201,110,0.5)'}`,
            animation: 'pulse-ring 1.5s ease-in-out infinite',
          }} />
        </>
      )}
      {/* Spinning arc (thinking) */}
      {status === 'thinking' && (
        <div style={{
          position: 'absolute', inset: -6,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'var(--green)',
          borderRightColor: 'var(--green)',
          animation: 'spin-slow 1.2s linear infinite',
        }} />
      )}
      {/* Main orb */}
      <div style={{
        width: 140, height: 140,
        borderRadius: '50%',
        background: status === 'speaking'
          ? 'radial-gradient(circle at 38% 38%, #fde68a, #d97706 60%, #7c2d12)'
          : status === 'listening'
          ? 'radial-gradient(circle at 38% 38%, #86efac, #00c96e 60%, #007a3d)'
          : status === 'thinking'
          ? 'radial-gradient(circle at 38% 38%, #67e8f9, #0ea5e9 60%, #1e3a5f)'
          : 'radial-gradient(circle at 38% 38%, #4ade80, #00a857 60%, #064e3b)',
        boxShadow: status === 'speaking'
          ? '0 0 40px rgba(245,200,66,0.5), inset 0 0 20px rgba(255,255,255,0.1)'
          : status === 'listening'
          ? '0 0 60px rgba(0,201,110,0.6), inset 0 0 20px rgba(255,255,255,0.15)'
          : '0 0 30px rgba(0,168,87,0.4), inset 0 0 20px rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isActive ? 'float 3s ease-in-out infinite' : 'none',
        transition: 'all 0.5s ease',
        cursor: 'default',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Inner face / icon */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 42 }}>
            {status === 'thinking' ? '🧠' : status === 'speaking' ? '💬' : status === 'listening' ? '👂' : '🤖'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, idx }) {
  const isGIA = msg.role === 'assistant'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isGIA ? 'flex-start' : 'flex-end',
      animation: 'message-in 0.35s ease forwards',
      animationDelay: `${idx * 0.05}s`,
      opacity: 0,
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: isGIA ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
        background: isGIA
          ? 'linear-gradient(135deg, var(--card), var(--bg3))'
          : 'linear-gradient(135deg, var(--green3), var(--green2))',
        border: `1px solid ${isGIA ? 'var(--border)' : 'transparent'}`,
        boxShadow: isGIA ? 'none' : '0 2px 16px rgba(0,201,110,0.25)',
      }}>
        {isGIA && (
          <div style={{
            fontSize: 10,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--green)',
            marginBottom: 6,
            textTransform: 'uppercase',
          }}>GIA</div>
        )}
        <p style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: isGIA ? 'var(--text)' : '#fff',
          margin: 0,
        }}>{msg.content}</p>
      </div>
    </div>
  )
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: 'var(--card)', borderRadius: '4px 18px 18px 18px', border: '1px solid var(--border)', width: 'fit-content' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
          animation: `dot-bounce 1.2s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Muraho! Welcome to Global Institute of People — Rwanda. My name is GIA, your AI Admissions and Career Advisor. How may I assist you today? You can speak to me or type your question below.',
  }])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('idle') // idle | listening | thinking | speaking
  const [transcript, setTranscript] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [lang, setLang] = useState('en')

  const chatEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  // Speak text
  const speak = useCallback((text) => {
    if (isMuted || !synthRef.current) return
    synthRef.current.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = lang === 'fr' ? 'fr-FR' : 'en-US'
    utt.rate = 0.95
    utt.pitch = 1.05
    utt.onstart = () => setStatus('speaking')
    utt.onend = () => setStatus('idle')
    utt.onerror = () => setStatus('idle')
    synthRef.current.speak(utt)
  }, [isMuted, lang])

  // Speak initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(messages[0].content)
    }, 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Send message to GIA
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', content: text }
    const newMessages = [...messagesRef.current, userMsg]
    setMessages(newMessages)
    setInput('')
    setStatus('thinking')

    try {
      // Build API messages (exclude initial system greeting from API history, only real turns)
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
      const reply = await callGIA(apiMessages)
      const assistantMsg = { role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])
      setStatus('idle')
      speak(reply)
    } catch (err) {
      const errMsg = { role: 'assistant', content: 'I apologize, there was a connection issue. Please try again.' }
      setMessages(prev => [...prev, errMsg])
      setStatus('idle')
    }
  }, [speak])

  // Voice recognition
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser. Please use Chrome.')
      return
    }
    synthRef.current?.cancel()
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SpeechRecognition()
    rec.lang = lang === 'fr' ? 'fr-FR' : lang === 'rw' ? 'rw-RW' : 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onstart = () => { setStatus('listening'); setTranscript('') }
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
    }
    rec.onend = () => {
      const final = recognitionRef.current?._lastTranscript || ''
      setTranscript('')
      if (final.trim()) sendMessage(final)
      else setStatus('idle')
    }
    rec.onerror = () => setStatus('idle')
    // Capture transcript on result
    rec.addEventListener('result', (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      recognitionRef.current._lastTranscript = t
    })
    recognitionRef.current = rec
    recognitionRef.current._lastTranscript = ''
    rec.start()
  }, [lang, sendMessage])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isListening = status === 'listening'
  const isThinking = status === 'thinking'
  const isSpeaking = status === 'speaking'

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -200, right: -200,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,201,110,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -150, left: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,168,87,0.05) 0%, transparent 70%)',
        }} />
        {/* Rwanda flag stripe accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #20603d, #fad201, #1a6ab1)' }} />
      </div>

      {/* Header */}
      <header style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(17,26,21,0.9)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Logo mark */}
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--green2), var(--green3))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 16px rgba(0,201,110,0.3)',
            flexShrink: 0,
          }}>🌍</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em', color: 'var(--text)', lineHeight: 1 }}>
              GIA <span style={{ color: 'var(--green)', fontWeight: 400 }}>by</span> GIP Rwanda
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Global Institute of People LLC</div>
          </div>
        </div>

        {/* Language selector + mute */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {['en', 'fr', 'rw'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '5px 10px', border: 'none', cursor: 'pointer',
                  fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: lang === l ? 'var(--green3)' : 'transparent',
                  color: lang === l ? '#fff' : 'var(--text3)',
                  transition: 'all 0.2s',
                }}
              >{l}</button>
            ))}
          </div>
          <button
            onClick={() => { setIsMuted(m => !m); if (!isMuted) synthRef.current?.cancel() }}
            style={{
              padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8,
              background: 'var(--bg3)', cursor: 'pointer', fontSize: 16, lineHeight: 1,
              color: 'var(--text2)', transition: 'all 0.2s',
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >{isMuted ? '🔇' : '🔊'}</button>
        </div>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* Sidebar — GIA avatar & status */}
        <div style={{
          width: 220,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 20px',
          borderRight: '1px solid var(--border)',
          background: 'rgba(17,26,21,0.5)',
          gap: 20,
        }}>
          <GIAOrb status={status} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--text)' }}>GIA</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Advisor</div>
          </div>

          {/* Status pill */}
          <div style={{
            padding: '6px 14px', borderRadius: 99,
            background: isListening ? 'rgba(0,201,110,0.15)' : isThinking ? 'rgba(56,189,248,0.15)' : isSpeaking ? 'rgba(245,200,66,0.15)' : 'var(--bg3)',
            border: `1px solid ${isListening ? 'rgba(0,201,110,0.4)' : isThinking ? 'rgba(56,189,248,0.4)' : isSpeaking ? 'rgba(245,200,66,0.4)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isListening ? 'var(--green)' : isThinking ? 'var(--blue)' : isSpeaking ? 'var(--gold)' : 'var(--text3)',
              animation: (isListening || isThinking || isSpeaking) ? 'pulse-ring 1s ease-in-out infinite' : 'none',
            }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: isListening ? 'var(--green)' : isThinking ? 'var(--blue)' : isSpeaking ? 'var(--gold)' : 'var(--text3)', letterSpacing: '0.05em' }}>
              {isListening ? 'Listening' : isThinking ? 'Thinking' : isSpeaking ? 'Speaking' : 'Ready'}
            </span>
          </div>

          {/* Live transcript */}
          {isListening && transcript && (
            <div style={{
              width: '100%', padding: '8px 12px', borderRadius: 8,
              background: 'rgba(0,201,110,0.08)', border: '1px solid rgba(0,201,110,0.2)',
              fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, fontStyle: 'italic',
            }}>"{transcript}"</div>
          )}

          {/* Audio bars */}
          <AudioBars active={isListening || isSpeaking} speaking={isSpeaking} />

          {/* Course highlight */}
          <div style={{ marginTop: 'auto', width: '100%', padding: '12px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Featured Course</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 6 }}>AI Architect & Strategic Advisor</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['30 Days', '$300', 'Paid Internship'].map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'rgba(0,201,110,0.12)', color: 'var(--green)', border: '1px solid rgba(0,201,110,0.2)' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '24px 24px 16px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} msg={msg} idx={idx} />
            ))}
            {isThinking && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'fade-in 0.3s ease' }}>
                <TypingIndicator />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{
            padding: '0 24px 12px',
            display: 'flex', gap: 8, flexWrap: 'wrap',
          }}>
            {['Tell me about the course', 'How much is the fee?', 'Is there an internship?', 'Can beginners join?'].map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={status === 'thinking' || status === 'listening'}
                style={{
                  padding: '6px 12px', borderRadius: 99,
                  border: '1px solid var(--border)',
                  background: 'var(--bg3)', cursor: 'pointer',
                  fontSize: 12, color: 'var(--text2)',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-body)',
                  opacity: (status === 'thinking' || status === 'listening') ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (status === 'idle' || status === 'speaking') { e.target.style.background = 'var(--card)'; e.target.style.color = 'var(--green)'; e.target.style.borderColor = 'var(--green3)' }}}
                onMouseLeave={e => { e.target.style.background = 'var(--bg3)'; e.target.style.color = 'var(--text2)'; e.target.style.borderColor = 'var(--border)' }}
              >{prompt}</button>
            ))}
          </div>

          {/* Input area */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            background: 'rgba(17,26,21,0.8)',
            backdropFilter: 'blur(20px)',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            {/* Voice button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isThinking}
              style={{
                width: 52, height: 52, borderRadius: '50%', border: 'none',
                cursor: isThinking ? 'not-allowed' : 'pointer',
                background: isListening
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, var(--green), var(--green2))',
                boxShadow: isListening
                  ? '0 0 20px rgba(239,68,68,0.5)'
                  : '0 0 20px rgba(0,201,110,0.4)',
                fontSize: 22,
                transition: 'all 0.3s',
                flexShrink: 0,
                opacity: isThinking ? 0.5 : 1,
                transform: isListening ? 'scale(1.1)' : 'scale(1)',
              }}
              title={isListening ? 'Stop' : 'Speak'}
            >
              {isListening ? '⏹' : '🎤'}
            </button>

            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Type your question here...'}
              disabled={isListening || isThinking}
              style={{
                flex: 1, padding: '14px 18px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--text)',
                fontSize: 14,
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--green3)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isListening || isThinking}
              style={{
                width: 52, height: 52, borderRadius: '50%', border: 'none',
                cursor: (!input.trim() || isListening || isThinking) ? 'not-allowed' : 'pointer',
                background: (!input.trim() || isListening || isThinking)
                  ? 'var(--bg3)'
                  : 'linear-gradient(135deg, var(--green), var(--green2))',
                boxShadow: (!input.trim() || isListening || isThinking)
                  ? 'none'
                  : '0 0 20px rgba(0,201,110,0.4)',
                fontSize: 20,
                opacity: (!input.trim() || isListening || isThinking) ? 0.4 : 1,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}
