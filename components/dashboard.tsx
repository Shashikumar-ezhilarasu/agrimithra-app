"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { NewsUpdates } from "@/components/news-updates"
import {
  Home,
  MessageCircle,
  ShoppingCart,
  Users,
  User,
  Mic,
  Camera,
  FileText,
  Wifi,
  Bell,
  Cloud,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Menu,
  Clock,
  MapPin,
  Sunrise,
  Sunset,
  BookOpen,
  FlaskConical
} from "lucide-react"

export function Dashboard() {
  const [weather, setWeather] = useState({ temp: "--°C", condition: "Detecting...", icon: Cloud })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const router = useRouter()
  const { t } = useLanguage()

  // Track mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Fetch live weather data
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
          const data = await res.json()
          if (data.current_weather) {
            const code = data.current_weather.weathercode
            let condition = "Clear"
            if (code >= 1 && code <= 3) condition = "Partly Cloudy"
            else if (code >= 45 && code <= 48) condition = "Foggy"
            else if (code >= 51 && code <= 67) condition = "Rainy"
            else if (code >= 71 && code <= 77) condition = "Snowy"
            else if (code >= 80 && code <= 99) condition = "Stormy"
            
            setWeather({
              temp: `${Math.round(data.current_weather.temperature)}°C`,
              condition: condition,
              icon: code === 0 ? Sunrise : Cloud 
            })
          }
        } catch (err) {
          console.error("Weather fetch failed", err)
        }
      })
    }
  }, [])

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Simulate voice recording with enhanced feedback
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        router.push("/chat?mode=voice")
      }, 3000)
    }
  }

  const quickInfoCards = [
    {
      title: t("marketPrices"),
      icon: TrendingUp,
      value: "Rice: ₹2,100/quintal",
      change: "+5.2%",
      changeType: "positive" as const,
      color: "text-green-600",
      details: "Wheat: ₹2,050, Corn: ₹1,800",
      topic: "market_prices",
    },
    {
      title: t("govtSchemes"),
      icon: FileCheck,
      value: "3 New Schemes",
      change: "Available",
      changeType: "neutral" as const,
      color: "text-blue-600",
      details: "PM-KISAN, Soil Health Card, Crop Insurance",
      topic: "govt_schemes",
    },
    {
      title: t("diseaseAlerts"),
      icon: AlertTriangle,
      value: "Leaf Blight",
      change: "High Risk",
      changeType: "negative" as const,
      color: "text-orange-600",
      details: "Affects rice crops in your region",
      topic: "disease_alerts",
    },
  ]

  const navigationItems = [
    { id: "home", icon: Home, label: t("dashboard"), path: "/dashboard" },
    { id: "chat", icon: MessageCircle, label: t("chat"), path: "/chat" },
    { id: "marketplace", icon: ShoppingCart, label: t("marketplace"), path: "/marketplace" },
    { id: "community", icon: Users, label: t("community"), path: "/community" },
    { id: "profile", icon: User, label: t("profile"), path: "/profile" },
  ]

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    setActiveTab(item.id)
    router.push(item.path)
  }

  const handleTextInput = () => {
    router.push("/chat?mode=text")
  }

  const handlePhotoInput = () => {
    router.push("/chat?mode=photo")
  }

  const handleNFCInput = () => {
    alert("📱 NFC scanning... Please place your NFC tag near the device")
    setTimeout(() => {
      router.push("/chat?mode=nfc&data=crop_info")
    }, 2000)
  }

  const handleQuickInfoClick = (card: (typeof quickInfoCards)[0]) => {
    router.push(`/chat?topic=${card.topic}`)
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Top Bar - Enhanced with Time & Location */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Weather & Location Widget */}
          <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100/50">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-100">
               <weather.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <p className="text-lg font-bold text-slate-800 leading-tight">{weather.temp}</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{weather.condition}</p>
              </div>
              <div className="flex items-center space-x-1 opacity-60">
                <MapPin className="h-3 w-3 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase">Live Location</p>
              </div>
            </div>
          </div>

          {/* Time Widget */}
          <div className="flex items-center space-x-2 text-right">
             <div className="hidden sm:block">
               <p className="text-sm font-bold text-slate-800 leading-none">
                 {mounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
               </p>
               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                 {mounted ? currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }) : "--- -- ---"}
               </p>
             </div>
             <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full border border-slate-100">
               <Bell className="h-5 w-5 text-slate-400" />
               <Badge className="absolute top-1 right-1 h-2 w-2 p-0 bg-emerald-500 border-2 border-white" />
             </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t("welcome")}</h1>
          </div>
          <p className="text-slate-500 font-medium ml-10">{t("askQuestion")}</p>
        </div>

        {/* Main Voice Feature Card */}
        <Card className="mb-8 overflow-hidden bg-white border-none shadow-2xl shadow-emerald-900/5 rounded-[2rem]">
          <CardContent className="p-8 text-center bg-gradient-to-br from-white to-emerald-50/30">
            <div className="mb-6 relative flex justify-center">
              <div className="absolute inset-0 bg-emerald-500 opacity-10 blur-3xl rounded-full scale-150" />
              <Button
                onClick={handleVoiceInput}
                size="lg"
                className={`h-24 w-24 rounded-[2rem] relative z-10 transition-all duration-500 transform ${
                  isListening
                    ? "bg-rose-500 hover:bg-rose-600 animate-pulse scale-110 shadow-2xl shadow-rose-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-200"
                } text-white`}
              >
                <Mic className="h-10 w-10" />
              </Button>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {isListening ? t("listening") : "Ask AgriMithra"}
            </h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
              {isListening ? "I'm listening to your voice query now..." : "Speak naturally about your crops, pests, or market concerns"}
            </p>

            {/* Input Methods Grid */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={handleTextInput}
                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
              >
                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white mb-2 transition-colors">
                  <FileText className="h-5 w-5 text-slate-500 group-hover:text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-emerald-700">{t("textQuery")}</span>
              </button>
              
              <button 
                onClick={handlePhotoInput}
                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
              >
                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white mb-2 transition-colors">
                  <Camera className="h-5 w-5 text-slate-500 group-hover:text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-emerald-700">{t("photoAnalysis")}</span>
              </button>

              <button 
                onClick={handleNFCInput}
                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
              >
                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white mb-2 transition-colors">
                  <Wifi className="h-5 w-5 text-slate-500 group-hover:text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-emerald-700">{t("nfcScan")}</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Updates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Quick Updates</h2>
             <div className="h-px bg-slate-100 flex-1 ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickInfoCards.map((card, index) => (
              <Card
                key={index}
                className="group bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 cursor-pointer rounded-2xl"
                onClick={() => handleQuickInfoClick(card)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 ${card.color} transition-colors`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        card.changeType === "positive" ? "bg-emerald-100 text-emerald-700" : 
                        card.changeType === "negative" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {card.change}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{card.title}</h4>
                  <p className="text-xs text-slate-500 mb-2 leading-relaxed">{card.details}</p>
                  <div className="pt-3 border-t border-slate-50">
                    <p className="text-sm font-black text-emerald-600">{card.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* News & Schemes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Latest Schemes & News</h2>
             <div className="h-px bg-slate-100 flex-1 ml-4" />
             <Button variant="ghost" className="text-emerald-600 font-bold text-xs">View All</Button>
          </div>
          <NewsUpdates />
        </div>

        {/* Bottom Actions Area */}
        <div className="grid grid-cols-4 gap-3">
          <button
            className="group flex-col flex items-center justify-center h-20 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-2xl transition-all"
            onClick={() => router.push("/marketplace")}
          >
            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors mb-1">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Market</span>
          </button>
          <button
            className="group flex-col flex items-center justify-center h-20 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-2xl transition-all"
            onClick={() => router.push("/community")}
          >
            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors mb-1">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Community</span>
          </button>
          <button
            className="group flex-col flex items-center justify-center h-20 bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-2xl transition-all"
            onClick={() => router.push("/hub")}
          >
            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors mb-1">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Hub</span>
          </button>
          <button
            className="group flex-col flex items-center justify-center h-20 bg-white hover:bg-amber-50 border border-slate-100 hover:border-amber-100 rounded-2xl transition-all"
            onClick={() => router.push("/hub?tab=prices")}
          >
            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-amber-50 transition-colors mb-1">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Prices</span>
          </button>
        </div>
      </div>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent pointer-events-none">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2rem] flex items-center justify-around p-2 pointer-events-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                activeTab === item.id 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
              onClick={() => handleNavigation(item)}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? "animate-bounce" : ""}`} />
              <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${activeTab === item.id ? "opacity-100" : "opacity-0"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
