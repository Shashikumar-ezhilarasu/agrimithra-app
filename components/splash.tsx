"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sprout, Leaf, MapPin, Clock, Cloud, Sunrise } from "lucide-react"

export function Splash() {
  const [isVisible, setIsVisible] = useState(false)
  const [weather, setWeather] = useState({ temp: "--°C", condition: "Detecting..." })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 300)
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000)
    
    // Fetch live weather data
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
            
            setWeather({
              temp: `${Math.round(data.current_weather.temperature)}°C`,
              condition: condition
            })
          }
        } catch (err) {
          console.error("Weather fetch failed", err)
        }
      })
    }

    return () => {
      clearTimeout(timer)
      clearInterval(clockTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Top Status Bar (Location & Time) */}
      <div 
        className={`absolute top-8 left-0 right-0 px-8 flex justify-between items-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Location</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <Clock className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-bold text-slate-700">
            {mounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
          </span>
        </div>
      </div>

      <div
        className={`text-center relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Logo Section */}
        <div className="relative mb-12">
          <div className="relative flex justify-center mb-6">
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="relative">
              <Sprout className="h-24 w-24 text-emerald-600" />
              <Leaf className="h-10 w-10 text-emerald-400 absolute -top-2 -right-4 animate-bounce" />
            </div>
          </div>
          <h1 className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">
            Agri<span className="text-emerald-600">Mithra</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium tracking-wide">Your 24/7 Digital Agri Expert</p>
        </div>

        {/* Live Weather Widget on Splash */}
        <div 
          className={`mb-12 inline-flex items-center space-x-4 bg-white p-5 rounded-[2rem] shadow-2xl shadow-emerald-900/5 border border-slate-50 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <Cloud className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="text-left">
             <p className="text-2xl font-black text-slate-800 leading-none">{mounted ? weather.temp : "--°C"}</p>
             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">{mounted ? weather.condition : "Detecting..."}</p>
          </div>
        </div>

        {/* Get Started Button */}
        <div
          className={`transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Button
            size="lg"
            className="group bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-8 text-xl font-bold rounded-[2rem] shadow-2xl shadow-emerald-200 transition-all duration-300 transform hover:scale-105"
            onClick={() => (window.location.href = "/onboarding")}
          >
            Get Started
            <Leaf className="ml-3 h-5 w-5 group-hover:rotate-45 transition-transform" />
          </Button>
        </div>
      </div>
      
      {/* Decorative footer text */}
      <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
        Empowering Indian Farmers
      </div>
    </div>
  )
}
