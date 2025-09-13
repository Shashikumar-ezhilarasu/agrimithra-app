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
import dynamic from "next/dynamic"
import { useUser } from "@clerk/nextjs";
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
  const { user } = useUser();
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
    name: user?.fullName || "Anonymous",
    phone: user?.primaryPhoneNumber?.toString() || "N/A",
    email: user?.primaryEmailAddress?.toString() || "N/A",
    location: t("location_kochi"),
    farmSize: `5.2 ${t("acres")}`,
    cropsGrown: [t("rice"), t("coconut"), t("pepper"), t("cardamom")],
    joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t("unknown"),
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
  description: t("changeAppLanguage"),
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
  description: t("manageNotifications"),
      action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      onClick: () => {},
    },
    {
      icon: Wifi,
  title: t("nfcManagement"),
  description: t("offlineAccessSettings"),
      action: <Switch checked={nfcEnabled} onCheckedChange={setNfcEnabled} />,
    },
    {
      icon: Bookmark,
  title: t("savedQueries"),
  description: `${farmerProfile.savedAnswers} ${t("savedAnswers")}`,
      action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      onClick: () => {},
    },
    {
      icon: HelpCircle,
  title: t("support"),
  description: t("getHelpContactUs"),
      action: <ChevronRight className="h-4 w-4 text-muted-foreground" />,
      onClick: () => {},
    },
    {
      icon: Info,
  title: t("aboutAgriMithra"),
  description: t("appInfoTeamDetails"),
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
                <AvatarImage src={user?.imageUrl || "/default-avatar.jpg"} alt={farmerProfile.name} />
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
                  <UserButtonNoSSR />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-2" />
                    {farmerProfile.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Wheat className="h-3 w-3 mr-2" />
                    {farmerProfile.farmSize} {t("farm")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" />
                    {t("joined")}: {farmerProfile.joinedDate}
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
              <p className="text-sm font-medium text-foreground mb-2">{t("cropsGrown")}</p>
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
                  <p className="text-xs text-muted-foreground">{t("totalQueries")}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{farmerProfile.savedAnswers}</p>
                  <p className="text-xs text-muted-foreground">{t("savedAnswers")}</p>
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
              <DialogTitle>{t("notificationSettings")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{t(key + "Label")}</p>
                    <p className="text-sm text-muted-foreground">{t(key + "Desc")}</p>
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
            <CardTitle className="text-lg">{t("helpSupport")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{t("liveChatSupport")}</p>
                  <p className="text-xs text-muted-foreground">{t("chatWithSupportTeam")}</p>
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
                  <p className="font-medium text-foreground text-sm">{t("faqGuides")}</p>
                  <p className="text-xs text-muted-foreground">{t("commonQuestionsTutorials")}</p>
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
                  <p className="font-medium text-foreground text-sm">{t("privacyTerms")}</p>
                  <p className="text-xs text-muted-foreground">{t("privacyPolicyTerms")}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("aboutAgriMithra")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                {t("aboutAgriMithraDesc")}
              </p>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span>{t("version")}</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span>{t("lastUpdated")}</span>
                <span className="font-medium">September 2025</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span>{t("developer")}</span>
                <span className="font-medium">{t("developerName")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
  <SignOutButtonNoSSR signOutOptions={{ sessionId: undefined }} redirectUrl="/auth">
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout")}
          </Button>
  </SignOutButtonNoSSR>
        
        {/* Legacy local cleanup handler retained as fallback */}
        {/* <Button onClick={handleLogout} variant="outline" className="w-full">{t("logout")}</Button> */}
      </div>
    </div>
  )
}

// Client-only Clerk components to avoid SSR in static export
const UserButtonNoSSR = dynamic(async () => (await import("@clerk/nextjs")).UserButton, {
  ssr: false,
})
const SignOutButtonNoSSR = dynamic(async () => (await import("@clerk/nextjs")).SignOutButton, {
  ssr: false,
})
