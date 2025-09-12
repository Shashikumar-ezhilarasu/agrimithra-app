"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
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
} from "lucide-react"

export function Dashboard() {
  const [isListening, setIsListening] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const router = useRouter()
  const { t } = useLanguage()

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
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          {/* Weather Widget */}
          <div className="flex items-center space-x-3">
            <Cloud className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">28°C</p>
              <p className="text-xs text-muted-foreground">Partly Cloudy</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-destructive text-destructive-foreground text-xs">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">{t("welcome")}</h1>
          <p className="text-muted-foreground">{t("askQuestion")}</p>
        </div>

        {/* Main Voice Feature */}
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Button
                onClick={handleVoiceInput}
                size="lg"
                className={`h-20 w-20 rounded-full ${
                  isListening
                    ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                    : "bg-primary hover:bg-primary/90"
                } text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <Mic className="h-8 w-8" />
              </Button>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isListening ? t("listening") : "Ask AgriMithra"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isListening ? "Speak now, I'm listening to your question" : "Tap to ask your farming question"}
            </p>

            {/* Alternative Input Methods */}
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" className="flex-1 max-w-24 bg-transparent" onClick={handleTextInput}>
                <FileText className="h-4 w-4 mr-1" />
                {t("textQuery")}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 max-w-24 bg-transparent" onClick={handlePhotoInput}>
                <Camera className="h-4 w-4 mr-1" />
                {t("photoAnalysis")}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 max-w-24 bg-transparent" onClick={handleNFCInput}>
                <Wifi className="h-4 w-4 mr-1" />
                {t("nfcScan")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Cards */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Quick Updates</h2>
          <div className="grid grid-cols-1 gap-3">
            {quickInfoCards.map((card, index) => (
              <Card
                key={index}
                className="bg-card hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleQuickInfoClick(card)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                        <card.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{card.title}</p>
                        <p className="text-xs text-muted-foreground">{card.value}</p>
                        <p className="text-xs text-muted-foreground/70">{card.details}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        card.changeType === "positive"
                          ? "default"
                          : card.changeType === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {card.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-16 flex-col space-y-1 bg-card hover:bg-muted border-border"
            onClick={() => router.push("/marketplace")}
          >
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{t("marketplace")}</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col space-y-1 bg-card hover:bg-muted border-border"
            onClick={() => router.push("/community")}
          >
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{t("community")}</span>
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex-col space-y-1 h-12 ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => handleNavigation(item)}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
