"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import {
  ArrowLeft,
  Globe,
  Bell,
  Wifi,
  Bookmark,
  HelpCircle,
  Info,
  LogOut,
  Edit,
  MapPin,
  Wheat,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  MessageCircle,
  FileText,
  Shield,
} from "lucide-react"

export function Profile() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    weather: true,
    market: true,
    community: false,
  })
  const [nfcEnabled, setNfcEnabled] = useState(true)

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  ]

  const farmerProfile = {
    name: "Ravi Kumar",
    phone: "+91 9876543210",
    email: "ravi.kumar@email.com",
    location: "Kochi, Kerala",
    farmSize: "5.2 acres",
    cropsGrown: ["Rice", "Coconut", "Pepper", "Cardamom"],
    joinedDate: "March 2024",
    totalQueries: 47,
    savedAnswers: 12,
  }

  const handleLogout = () => {
    localStorage.removeItem("agrimithra-language")
    router.push("/")
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const settingsItems = [
    {
      icon: Globe,
      title: t("languageSettings"),
      description: "Change app language",
      action: (
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.native}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      icon: Bell,
      title: t("notifications"),
      description: "Manage notification preferences",
      action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      onClick: () => {},
    },
    {
      icon: Wifi,
      title: "NFC Management",
      description: "Offline access settings",
      action: <Switch checked={nfcEnabled} onCheckedChange={setNfcEnabled} />,
    },
    {
      icon: Bookmark,
      title: "Saved Queries",
      description: `${farmerProfile.savedAnswers} saved answers`,
      action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      title: "Support",
      description: "Get help and contact us",
      action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      onClick: () => {},
    },
    {
      icon: Info,
      title: "About AgriMithra",
      description: "App info and team details",
      action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      onClick: () => {},
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t("profile")}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/farmer-avatar.jpg" alt={farmerProfile.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {farmerProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-foreground">{farmerProfile.name}</h2>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-2" />
                    {farmerProfile.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Wheat className="h-3 w-3 mr-2" />
                    {farmerProfile.farmSize} farm
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" />
                    Joined {farmerProfile.joinedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-3 w-3 mr-2" />
                  {farmerProfile.phone}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-3 w-3 mr-2" />
                  {farmerProfile.email}
                </div>
              </div>
            </div>

            {/* Crops Grown */}
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-2">Crops Grown:</p>
              <div className="flex flex-wrap gap-2">
                {farmerProfile.cropsGrown.map((crop) => (
                  <Badge key={crop} variant="secondary" className="text-xs">
                    {crop}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{farmerProfile.totalQueries}</p>
                  <p className="text-xs text-muted-foreground">Total Queries</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{farmerProfile.savedAnswers}</p>
                  <p className="text-xs text-muted-foreground">Saved Answers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("settings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={item.onClick}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {item.action}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notification Settings Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="hidden">Notifications</div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-sm text-muted-foreground">
                      {key === "push" && "Receive push notifications"}
                      {key === "email" && "Get updates via email"}
                      {key === "sms" && "SMS notifications for important alerts"}
                      {key === "weather" && "Weather and climate updates"}
                      {key === "market" && "Market price changes"}
                      {key === "community" && "Community posts and messages"}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Support Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Help & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Live Chat Support</p>
                  <p className="text-xs text-muted-foreground">Chat with our support team</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">FAQ & Guides</p>
                  <p className="text-xs text-muted-foreground">Common questions and tutorials</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Privacy & Terms</p>
                  <p className="text-xs text-muted-foreground">Privacy policy and terms of service</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About AgriMithra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                AgriMithra is your 24/7 digital agriculture expert, designed to empower farmers with AI-powered
                advisory, real-time market information, and community support.
              </p>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span>Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span>Last Updated</span>
                <span className="font-medium">December 2024</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span>Developer</span>
                <span className="font-medium">AgriTech Solutions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t("logout")}
        </Button>
      </div>
    </div>
  )
}
