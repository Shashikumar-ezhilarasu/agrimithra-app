"use client"

import React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Mic, TrendingUp, Users } from "lucide-react"

const onboardingSlides = [
  {
    icon: Mic,
    titleKey: "onboarding_slide1_title",
    descriptionKey: "onboarding_slide1_desc",
    illustration: "🎤",
  },
  {
    icon: TrendingUp,
    titleKey: "onboarding_slide2_title",
    descriptionKey: "onboarding_slide2_desc",
    illustration: "📈",
  },
  {
    icon: Users,
    titleKey: "onboarding_slide3_title",
    descriptionKey: "onboarding_slide3_desc",
    illustration: "🤝",
  },
]

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useLanguage()

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      window.location.href = "/auth"
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const skipOnboarding = () => {
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("back")}
        </Button>
        <Button variant="ghost" size="sm" onClick={skipOnboarding} className="text-muted-foreground">
          {t("skip")}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            {/* Illustration */}
            <div className="mb-8">
              <div className="text-6xl mb-4">{onboardingSlides[currentSlide].illustration}</div>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                {React.createElement(onboardingSlides[currentSlide].icon, { className: "h-8 w-8 text-primary" })}
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-foreground mb-4 text-balance">
              {t(onboardingSlides[currentSlide].titleKey)}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed text-pretty">
              {t(onboardingSlides[currentSlide].descriptionKey)}
            </p>
          </CardContent>
        </Card>

        {/* Progress Dots */}
        <div className="flex space-x-2 mt-8 mb-8">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-6" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <Button
          onClick={nextSlide}
          size="lg"
          className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
        >
          {currentSlide === onboardingSlides.length - 1 ? t("getStarted") : t("next")}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
