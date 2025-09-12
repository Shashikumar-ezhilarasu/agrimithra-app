"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, Globe, ArrowRight } from "lucide-react"

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
]

export function Auth() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  const { setLanguage, t } = useLanguage()

  useEffect(() => {
    setLanguage(selectedLanguage)
  }, [selectedLanguage, setLanguage])

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep("otp")
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    // Simulate Google sign-in
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Selection */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <Label htmlFor="language" className="text-sm font-medium text-foreground">
                  {t("languageSettings")}
                </Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.native}</span>
                          <span className="text-muted-foreground">({lang.name})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Auth Card */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              {step === "phone" ? t("welcome") : t("verifyNumber")}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {step === "phone" ? t("enterPhoneToStart") : `${t("sentCodeTo")} ${phoneNumber}`}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === "phone" ? (
              <>
                {/* Phone Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    {t("phoneNumber")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t("enterPhone")}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Send OTP Button */}
                <Button
                  onClick={handleSendOTP}
                  disabled={!phoneNumber || phoneNumber.length < 10 || isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  size="lg"
                >
                  {isLoading ? t("sending") : t("sendOTP")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Separator */}
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    {t("or")}
                  </span>
                </div>

                {/* Google Sign In */}
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full border-border hover:bg-muted bg-transparent"
                  size="lg"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isLoading ? t("signingIn") : t("continueWithGoogle")}
                </Button>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                    {t("enterOTP")}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder={t("enterOTPPlaceholder")}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleVerifyOTP}
                  disabled={!otp || otp.length < 4 || isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  size="lg"
                >
                  {isLoading ? t("verifying") : t("verifyAndContinue")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Resend OTP */}
                <Button
                  onClick={() => setStep("phone")}
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  {t("changePhone")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          {t("termsAndPrivacy")}
        </p>
      </div>
    </div>
  )
}
