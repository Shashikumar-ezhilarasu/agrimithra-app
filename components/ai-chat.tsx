"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft, Mic, Camera, Send, Volume2, Bookmark, Share2, MoreVertical, User, Bot, Video } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  isTyping?: boolean
  mediaType?: "text" | "image" | "audio" | "video"
  mediaUrl?: string
}

const enhancedResponses = {
  image_analysis: [
    "🔍 **Image Analysis Complete!** I can see brown leaf spots on your rice crop. This appears to be **Leaf Blight Disease**. \n\n**Treatment:** Apply Propiconazole 25% EC @ 1ml/liter water. Spray during early morning or evening. \n\n**Prevention:** Ensure proper field drainage and remove affected leaves immediately.",
    "📸 **Crop Disease Detected!** Your tomato plants show signs of **Early Blight**. The circular brown spots with concentric rings are characteristic symptoms. \n\n**Immediate Action:** Use copper-based fungicide spray. Remove infected leaves and improve air circulation. \n\n**Confidence:** 92%",
    "🌾 **Nutrient Deficiency Identified!** Your wheat crop shows **Nitrogen Deficiency** - yellowing from older leaves upward. \n\n**Solution:** Apply Urea @ 50kg/acre immediately. Follow up with balanced NPK fertilizer. \n\n**Expected Recovery:** 7-10 days",
  ],
  audio_analysis: [
    "🎤 **Voice Query Processed!** I heard you asking about pest control in cotton crops. \n\n**For Cotton Bollworm:** Use pheromone traps and spray Bacillus thuringiensis (Bt) @ 2g/liter water. Monitor weekly and spray during evening hours. \n\n**Cost:** ₹200-300 per acre",
    "🔊 **Audio Analysis Complete!** Based on your voice query about irrigation timing, here's my recommendation: \n\n**Best Time:** Early morning (5-7 AM) or evening (6-8 PM). Avoid midday watering as it leads to water loss through evaporation. \n\n**Frequency:** Every 2-3 days depending on soil moisture.",
    "🎵 **Voice Command Understood!** You asked about market prices. Current rates in your area: \n\n**Rice:** ₹2,100/quintal (+5.2%) \n**Wheat:** ₹2,050/quintal (+2.1%) \n**Corn:** ₹1,800/quintal (-1.5%) \n\n**Recommendation:** Good time to sell rice!",
  ],
  video_analysis: [
    "🎥 **Video Analysis Complete!** I analyzed your field walkthrough video. Your crop growth looks healthy overall, but I noticed: \n\n**Issues Found:** \n• Uneven plant spacing in rows 3-5 \n• Some yellowing in the northeast corner \n• Water stagnation near the boundary \n\n**Recommendations:** Improve drainage and apply balanced fertilizer to affected areas.",
    "📹 **Field Video Processed!** Great documentation of your farming practices! I observed: \n\n**Positive Points:** \n• Excellent weed management \n• Proper plant height and density \n• Good irrigation coverage \n\n**Suggestions:** Consider mulching to retain soil moisture and reduce weed growth further.",
    "🎬 **Video Assessment Done!** Your harvesting technique video shows good practices. However: \n\n**Improvements:** \n• Harvest during early morning for better grain quality \n• Use proper storage containers to prevent moisture \n• Clean equipment between different crop varieties \n\n**Estimated Yield:** 25-30 quintals/acre",
  ],
  nfc_data: [
    "📱 **NFC Tag Data Retrieved!** \n\n**Crop Info:** Rice (Variety: IR64) \n**Planted:** June 15, 2024 \n**Growth Stage:** Tillering (45 days) \n**Last Fertilizer:** NPK applied 10 days ago \n\n**Next Actions:** Apply nitrogen top-dressing and maintain 2-3cm water level.",
    "🏷️ **NFC Scan Successful!** \n\n**Field Data:** Tomato Crop \n**Variety:** Hybrid F1 \n**Planted:** July 20, 2024 \n**Current Stage:** Flowering \n**Irrigation:** Drip system active \n\n**Recommendations:** Apply potassium-rich fertilizer for better fruit development.",
    "📲 **Tag Information Loaded!** \n\n**Equipment:** Tractor (Mahindra 575) \n**Last Service:** November 2024 \n**Engine Hours:** 1,247 \n**Next Service:** Due in 50 hours \n\n**Maintenance Alert:** Check hydraulic fluid levels and clean air filter.",
  ],
}

const topicResponses = {
  market_prices:
    "📈 **Current Market Rates:** \n\n**Rice:** ₹2,100/quintal (+5.2%) \n**Wheat:** ₹2,050/quintal (+2.1%) \n**Corn:** ₹1,800/quintal (-1.5%) \n**Sugarcane:** ₹350/quintal (+3.8%) \n\n**Trend Analysis:** Rice prices expected to remain stable this week. Good time to sell!",
  govt_schemes:
    "🏛️ **Available Government Schemes:** \n\n**1. PM-KISAN:** ₹6,000/year direct benefit transfer \n**2. Soil Health Card:** Free soil testing \n**3. Crop Insurance:** Premium subsidy up to 90% \n**4. KCC (Kisan Credit Card):** Low-interest agricultural loans \n\n**Apply Online:** pmkisan.gov.in or visit nearest agriculture office",
  disease_alerts:
    "⚠️ **Current Disease Alerts in Your Region:** \n\n**HIGH RISK:** \n• Leaf blight in rice crops \n• Late blight in potato \n\n**MODERATE RISK:** \n• Powdery mildew in wheat \n• Aphid infestation in mustard \n\n**Prevention:** Apply preventive fungicide spray and maintain field hygiene.",
}

export function AIChat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, language } = useLanguage()
  const mode = searchParams.get("mode")
  const topic = searchParams.get("topic")

  const [geminiStatus, setGeminiStatus] = useState("connecting")
  useEffect(() => {
    // Check Gemini API connection on mount
    async function checkGemini() {
      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "ping" }),
        })
        const data = await response.json()
        if (response.ok && data?.result) {
          setGeminiStatus("connected")
        } else {
          setGeminiStatus("error")
        }
      } catch {
        setGeminiStatus("error")
      }
    }
    checkGemini()
  }, [])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: t("aiWelcome") ||
        "🌾 Hello! I'm your AgriMithra AI assistant. I can help you with:\n\n• 📸 Image Analysis - Crop disease detection\n• 🎤 Voice Queries - Natural language farming questions\n• 🎥 Video Analysis - Field assessment and techniques\n• 📱 NFC Data - Smart tag information\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode === "photo") {
      handleImageUpload()
    } else if (mode === "video") {
      handleVideoUpload()
    } else if (mode === "voice") {
      handleVoiceInput()
    } else if (mode === "nfc") {
      handleNFCData()
    } else if (topic && topic in topicResponses) {
      handleTopicQuery(topic)
    }
  }, [mode, topic])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTopicQuery = (topicKey: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Tell me about ${topicKey.replace("_", " ")}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: topicResponses[topicKey as keyof typeof topicResponses] || "I can help you with that topic!",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleNFCData = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "📱 [NFC Tag Scanned]",
      timestamp: new Date(),
      mediaType: "text",
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const responses = enhancedResponses.nfc_data
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleImageUpload = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "📷 [Crop Image Uploaded for Analysis]",
      timestamp: new Date(),
      mediaType: "image",
      mediaUrl: "/rice-grains.jpg",
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const responses = enhancedResponses.image_analysis
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 3000)
  }

  const handleVideoUpload = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: "🎥 [Field Video Uploaded for Analysis]",
      timestamp: new Date(),
      mediaType: "video",
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const responses = enhancedResponses.video_analysis
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 4000)
  }

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)
      setIsRecording(true)

      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: "🎤 [Voice Recording...]",
        timestamp: new Date(),
        mediaType: "audio",
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        setIsListening(false)
        setIsRecording(false)

        // Update the user message to show completed recording
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, content: "🎤 [Voice Query: How to control pests in my cotton crop?]" }
              : msg,
          ),
        )

        setIsTyping(true)

        setTimeout(() => {
          const responses = enhancedResponses.audio_analysis
          const aiResponse: Message = {
            id: (Date.now() + 2).toString(),
            type: "ai",
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiResponse])
          setIsTyping(false)
        }, 1500)
      }, 3000)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Gemini API integration via Next.js API route
    let retries = 0
    const maxRetries = 3
    let aiText = ""
    let errorMsg = ""
    const prompt = `Reply in ${language}. Begin with: 'To answer your question about ${inputText},' and then provide a longer, conversational, helpful response for Indian farmers.`
    while (retries < maxRetries) {
      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })
        const data = await response.json()
        aiText = data?.result
        if (response.status === 503) {
          errorMsg = t("geminiOverloaded") || "Gemini is overloaded. Retrying..."
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: errorMsg,
            timestamp: new Date(),
          }])
          retries++
          await new Promise((resolve) => setTimeout(resolve, 2000))
          continue
        }
        if ((!aiText || aiText.length < 5) && data?.error) {
          aiText = `Gemini Error: ${data.error}`
        }
        if (!aiText || aiText.length < 5) {
          aiText = t("aiError") || "Sorry, I couldn't get an answer from Gemini. Please try again later."
        }
        break
      } catch (err) {
        aiText = `Gemini Error: ${err instanceof Error ? err.message : String(err)}`
        break
      }
    }
    setMessages((prev) => [...prev, {
      id: (Date.now() + 2).toString(),
      type: "ai",
      content: aiText,
      timestamp: new Date(),
    }])
    setIsTyping(false)
  }

  const handleTextToSpeech = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.")
      return
    }
    // Map app language to BCP-47 language code
    const langMap: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      ta: "ta-IN",
      ml: "ml-IN",
      kn: "kn-IN",
    }
    const synth = window.speechSynthesis
    const utter = new window.SpeechSynthesisUtterance(text)
    utter.lang = langMap[language] || "en-IN"
    utter.rate = 1
    utter.pitch = 1
    synth.cancel() // Stop any previous speech
    synth.speak(utter)
  }

  const handleSaveAnswer = (messageId: string) => {
    console.log("[v0] Saved message:", messageId)
    alert("💾 Answer saved to your library!")
  }

  const handleShareAnswer = (messageId: string) => {
    console.log("[v0] Shared message:", messageId)
    alert("📤 Answer shared with community!")
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
    setTimeout(() => {
      if (suggestion) {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: suggestion,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)

        setTimeout(() => {
          let responseContent = "Here's detailed information about your query with practical farming solutions."
          if (suggestion.includes("price")) responseContent = topicResponses.market_prices
          else if (suggestion.includes("schemes")) responseContent = topicResponses.govt_schemes
          else if (suggestion.includes("disease")) responseContent = topicResponses.disease_alerts

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: responseContent,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiResponse])
          setIsTyping(false)
        }, 1500)
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">AgriMithra AI</h1>
              <p className="text-xs text-muted-foreground">
                {isTyping
                  ? t("typing")
                  : isListening
                  ? t("listening")
                  : geminiStatus === "connected"
                  ? t("connected") || "Connected"
                  : geminiStatus === "error"
                  ? t("aiError") || "Offline"
                  : "Connecting..."}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                <div
                  className={`rounded-2xl p-3 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground ml-2"
                      : "bg-card border border-border mr-2"
                  }`}
                >
                  {message.mediaType === "image" && message.mediaUrl && (
                    <img
                      src={message.mediaUrl || "/placeholder.svg"}
                      alt="Uploaded crop"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* AI Message Actions */}
                {message.type === "ai" && (
                  <div className="flex items-center space-x-2 mt-2 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTextToSpeech(message.content)}
                      className="h-6 px-2 text-xs"
                    >
                      <Volume2 className="h-3 w-3 mr-1" />
                      Listen
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveAnswer(message.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShareAnswer(message.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className={`${message.type === "user" ? "order-1" : "order-2"}`}>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-muted" : "bg-primary"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="bg-card border border-border rounded-2xl p-3 mr-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center space-x-2">
          {/* Voice Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceInput}
            className={`${isListening ? "bg-destructive text-destructive-foreground animate-pulse" : ""}`}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Text Input */}
          <div className="flex-1">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? t("listening") : t("askFarmingQuestion")}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isListening}
              className="border-border"
            />
          </div>

          {/* Media Upload Buttons */}
          <Button variant="ghost" size="sm" onClick={handleImageUpload}>
            <Camera className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleVideoUpload}>
            <Video className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isListening}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            t("cropDiseaseAnalysis"),
            t("currentMarketPrices"),
            t("weatherForecast"),
            t("governmentSchemes"),
            t("fertilizerRecommendations"),
            t("pestControlMethods"),
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs bg-transparent border-border hover:bg-muted"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
