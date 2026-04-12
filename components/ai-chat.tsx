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

// Named export for direct imports
export function AIChat() {
  const [model, setModel] = useState("gemini")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language, setLanguage, t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [geminiStatus, setGeminiStatus] = useState("idle")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const mode = searchParams?.get("mode")
  const topic = searchParams?.get("topic")

  useEffect(() => {
    // Check Gemini API connection on mount
    async function checkGemini() {
      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "hello" }),
        })
        if (response.ok) {
          setGeminiStatus("online")
        } else {
          // Check if this is a quota error but we have multiple keys available
          const errorData = await response.json()
          if (response.status === 429 && !errorData.allKeysFailed) {
            // We have more keys to try
            setGeminiStatus("online")
          } else {
            setGeminiStatus("offline")
          }
        }
      } catch (error) {
        setGeminiStatus("offline")
      }
    }
    checkGemini()
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

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
    } else {
      // Set initial message
      setMessages([
        {
          id: "1",
          type: "ai",
          content: t("welcomeMessage"),
          timestamp: new Date(),
        },
      ])
    }
  }, [mode, topic, t])

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
    setShowSuggestions(false)
    
    // Ensure we're using the current language from the context
    // This ensures responses match the language the user has selected

    let aiText = ""
    if (model === "gemini") {
      let retries = 0
      const maxRetries = 3
      let errorMsg = ""
      // Create a language-specific prompt
      const languageNames = {
        'en': 'English',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'ml': 'Malayalam',
        'kn': 'Kannada',
        'te': 'Telugu'
      };
      
      const langName = languageNames[language as keyof typeof languageNames] || 'English';
      const prompt = `You are a helpful farming assistant for Indian farmers. The user's query is in ${langName}. 
YOUR RESPONSE MUST BE ENTIRELY IN ${langName} ONLY. DO NOT USE ANY OTHER LANGUAGE.
Query: ${inputText}

Give a detailed, conversational, and helpful response for farmers.`;
      while (retries < maxRetries) {
        try {
          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          })
          const data = await response.json()
          
          // Check for successful response
          if (response.ok && data?.result) {
            aiText = data.result;
            break;
          }
          
          // Handle different error cases
          if (response.status === 429) {
            // Quota exceeded error - our API handler will try multiple keys
            if (data?.allKeysFailed) {
              // All API keys have reached quota limits
              aiText = t("allKeysExceeded") || "All available API keys have reached their quota limits. Please try again later.";
              break;
            } else {
              // Some keys may still work - the handler will try another key
              errorMsg = t("geminiOverloaded") || "Switching to another API key...";
              setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: errorMsg,
                timestamp: new Date(),
              }]);
              retries++;
              await new Promise((resolve) => setTimeout(resolve, 2000));
              continue;
            }
          } else if (response.status === 503) {
            // Service unavailable
            errorMsg = t("geminiOverloaded") || "Gemini is overloaded. Retrying...";
            setMessages((prev) => [...prev, {
              id: (Date.now() + 1).toString(),
              type: "ai",
              content: errorMsg,
              timestamp: new Date(),
            }]);
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            continue;
          }
          
          // General error handling
          if (data?.error) {
            aiText = `Gemini Error: ${data.error}`;
          } else {
            aiText = t("aiError") || "Sorry, I couldn't get an answer from Gemini. Please try again later.";
          }
          break;
        } catch (err) {
          aiText = `Gemini Error: ${err instanceof Error ? err.message : String(err)}`;
          break;
        }
      }
    } else if (model === "rag") {
      try {
        const response = await fetch("/api/rag-chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: inputText, language }),
        })
        const data = await response.json()
        aiText = data?.answer || t("aiError")
      } catch (err) {
        aiText = t("aiError") || "RAG backend unavailable."
      }
    }

    const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: aiText,
        timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
    setIsTyping(false)
  }

  const handleTextToSpeech = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.")
      return
    }
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
    synth.cancel()
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
        handleSendMessage()
      }
    }, 100)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(status => {
           if (status) return false;
           return status;
        })
      }
    }
  }, [])

  const startVoiceCapture = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    } else if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      alert("Speech recognition is not supported in this browser.")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const url = event.target?.result as string
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "📷 Analysis request for: " + file.name,
          timestamp: new Date(),
          mediaType: "image",
          mediaUrl: url,
        }
        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)

        try {
          // 1. Try Local ML prediction first
          let localPrediction = null;
          try {
            const mlRes = await fetch("http://localhost:8001/predict", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ image: url }),
            });
            if (mlRes.ok) {
              localPrediction = await mlRes.json();
            }
          } catch (e) {
            console.warn("Local ml_service not available, falling back to Gemini.");
          }

          // 2. Decide: Use local result or fallback to Gemini
          // Fail back if no local ml, error status, or low confidence (< 0.7)
          if (!localPrediction || localPrediction.status === "error" || localPrediction.confidence < 0.7) {
            console.log("Local ML uncertain or unavailable. Requesting Gemini analysis...");
            const response = await fetch("/api/gemini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                prompt: `Analyze this image for agricultural diseases. (Local ML predicted: ${localPrediction?.label || 'Unknown'} with ${Math.round((localPrediction?.confidence || 0) * 100)}% confidence). Please provide an expert diagnosis and mitigation projects.`, 
                imageData: url 
              }),
            })
            const data = await response.json()
            if (response.ok && data.result) {
              setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: data.result,
                timestamp: new Date(),
              }])
            }
          } else {
             // 3. Local ML succeeded with high confidence
             setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: `🌱 **Local ML Prediction**: ${localPrediction.label.replace(/_/g, ' ')}\n🎯 **Confidence**: ${Math.round(localPrediction.confidence * 100)}%\n\nThis is a high-confidence match from our specialized leaf-disease detector. Please ensure proper ventilation and check moisture levels. For a more detailed analysis, you can ask for Gemini's second opinion!`,
                timestamp: new Date(),
             }])
          }
        } catch (err) {
          console.error("Analysis failed", err)
        } finally {
          setIsTyping(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const [chatId, setChatId] = useState<string | null>(null)
  const [recentChats, setRecentChats] = useState<any[]>([])

  // Load recent chats from MongoDB
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/chat-history")
        if (res.ok) {
          const data = await res.json()
          setRecentChats(data)
        }
      } catch (err) {
        console.error("Failed to fetch history", err)
      }
    }
    fetchHistory()
  }, [])

  // Auto-save chat when messages change
  useEffect(() => {
    if (messages.length > 2) { // Save after first response
       const saveChat = async () => {
         try {
           const res = await fetch("/api/chat-history", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ messages, chatId }),
           })
           if (res.ok) {
             const data = await res.json()
             if (!chatId) setChatId(data._id)
           }
         } catch (err) {
           console.error("Failed to save chat", err)
         }
       }
       const timer = setTimeout(saveChat, 2000)
       return () => clearTimeout(timer)
    }
  }, [messages, chatId])

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
      {/* Top Bar - More Premium */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/60 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-emerald-200 shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-slate-800 tracking-tight">AgriMithra AI</h1>
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2 h-2 rounded-full ${geminiStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isTyping ? t("typing") : geminiStatus === 'online' ? 'Expert Active' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-[10px] font-bold text-slate-400"
                onClick={() => {
                   setMessages([{ id: "1", type: "ai", content: t("welcomeMessage"), timestamp: new Date() }]);
                   setChatId(null);
                }}
            >
                NEW
            </Button>
            <select 
                value={model} 
                onChange={e => setModel(e.target.value)} 
                className="text-[10px] font-bold bg-slate-100 border-none rounded-lg px-2 py-1.5 outline-none text-slate-500 appearance-none cursor-pointer"
            >
                <option value="gemini">GEMINI</option>
                <option value="rag">AGRI RAG</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Space */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col max-w-[85%] ${message.type === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`relative rounded-2xl px-4 py-3 shadow-sm ${
                    message.type === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {message.mediaType === "image" && message.mediaUrl && (
                    <div className="relative group mb-2 overflow-hidden rounded-xl border border-white/20">
                      <img
                        src={message.mediaUrl}
                        alt="Crop analysis query"
                        className="w-full max-h-60 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Markdown Rendering for Professional Display */}
                  <div className="text-[15px] leading-relaxed font-medium markdown-content">
                    {message.type === 'ai' ? (
                      <div className="prose prose-sm prose-slate max-w-none">
                        {message.content.replace(/\*\*/g, '').split('\n').map((line, i) => (
                           <p key={i} className="mb-2 last:mb-0">{line}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{message.content}</p>
                    )}
                  </div>
                  
                  <div className={`flex items-center mt-1.5 opacity-40 text-[10px] uppercase tracking-tighter font-bold ${message.type === "user" ? "justify-end text-white" : "text-slate-500"}`}>
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </div>
                </div>

                {message.type === "ai" && (
                  <div className="flex items-center space-x-1 mt-2.5">
                    <Button variant="ghost" size="icon" onClick={() => handleTextToSpeech(message.content)} className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleSaveAnswer(message.id)} className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleShareAnswer(message.id)} className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-none px-5 py-3.5 shadow-sm">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area - Redesigned for Mobile */}
      <div className="bg-white border-t border-slate-100 p-4 pb-8 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          {showSuggestions && messages.length < 3 && (
            <ScrollArea className="w-full whitespace-nowrap mb-4 pb-2">
              <div className="flex space-x-2">
                {[
                  t("cropDiseaseAnalysis"),
                  t("currentMarketPrices"),
                  t("weatherForecast"),
                  t("governmentSchemes"),
                  t("fertilizerRecommendations"),
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-slate-100 hover:bg-emerald-50 text-slate-600 border-none rounded-full whitespace-nowrap"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-3xl p-1.5 pl-4 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Tell me about your crop..."}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="bg-transparent border-none focus-visible:ring-0 shadow-none text-slate-800 font-medium placeholder:text-slate-400"
            />
            
            <div className="flex items-center pr-1.5 space-x-1">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()} 
                className="h-10 w-10 rounded-full text-slate-400 hover:text-emerald-500 hover:bg-white"
              >
                <Camera className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={startVoiceCapture} 
                className={`h-10 w-10 rounded-full transition-all ${isListening ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-emerald-500 hover:bg-white"}`}
              >
                <Mic className="h-5 w-5" />
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() && !isListening}
                size="icon"
                className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default export for legacy compatibility
export default AIChat
