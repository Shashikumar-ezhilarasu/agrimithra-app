"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sprout, Leaf } from "lucide-react"

export function Splash() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-6">
      <div
        className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Logo */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sprout className="h-16 w-16 text-primary animate-pulse" />
              <Leaf className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 font-sans">AgriMithra</h1>
          <p className="text-lg text-muted-foreground font-medium">Your 24/7 Digital Agri Expert</p>
        </div>

        {/* Get Started Button */}
        <div
          className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => (window.location.href = "/onboarding")}
          >
            Get Started
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-primary rounded-full animate-pulse opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-secondary rounded-full animate-bounce opacity-40"></div>
        </div>
      </div>
    </div>
  )
}
