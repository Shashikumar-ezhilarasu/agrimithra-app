"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"

const languages = [
	{ code: "en", name: "English", native: "English" },
	{ code: "hi", name: "Hindi", native: "हिंदी" },
	{ code: "ml", name: "Malayalam", native: "മലയാളം" },
	{ code: "ta", name: "Tamil", native: "தமிழ்" },
	{ code: "te", name: "Telugu", native: "తెలుగు" },
	{ code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
]

export function Auth() {
	const [selectedLanguage, setSelectedLanguage] = useState("en")
	const [view, setView] = useState<"sign-in" | "sign-up">("sign-in")
	const { setLanguage, t } = useLanguage()
	const searchParams = useSearchParams()
	const router = useRouter()
	const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

	useEffect(() => {
		setLanguage(selectedLanguage)
	}, [selectedLanguage, setLanguage])

	useEffect(() => {
		const v = searchParams?.get?.("view")
		if (v === "sign-up" || v === "sign-in") setView(v)
	}, [searchParams])

	// When Clerk is configured, Clerk widgets themselves handle redirects after auth.
	// We intentionally avoid calling Clerk hooks here to prevent crashes when ClerkProvider is absent.

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

				{/* If Clerk is not configured, render a friendly fallback instead of crashing */}
				{!publishableKey ? (
					<Card className="bg-card border-border shadow-lg">
						<CardHeader className="text-center pb-0">
							<CardTitle className="text-2xl font-bold text-foreground">
								{t("signIn")}
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-4 text-center text-sm text-muted-foreground">
							<p className="mb-3">Authentication is not configured for this deployment.</p>
							<p className="mb-4">Add Clerk environment variables and redeploy to enable sign-in.</p>
							<div className="flex items-center justify-center gap-2">
								<button
									className="px-4 py-2 rounded-md border"
									onClick={() => router.push("/")}
								>
									{t("back")}
								</button>
							</div>
						</CardContent>
					</Card>
				) : (
				<Card className="bg-card border-border shadow-lg">
					<CardHeader className="text-center pb-0">
						<CardTitle className="text-2xl font-bold text-foreground">
							{view === "sign-in" ? t("signIn") : t("signUp")}
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-2">
						{view === "sign-in" ? (
							<SignInNoSSR
								appearance={{ elements: { card: "shadow-none border-0 bg-transparent" } }}
								afterSignInUrl="/dashboard"
								signUpUrl="/auth?view=sign-up"
							/>
						) : (
							<SignUpNoSSR
								appearance={{ elements: { card: "shadow-none border-0 bg-transparent" } }}
								afterSignUpUrl="/dashboard"
								signInUrl="/auth?view=sign-in"
							/>
						)}
					</CardContent>
				</Card>
				)}
			</div>
		</div>
	)
}

// Dynamically import Clerk widgets client-only to avoid SSR errors when env is missing
const SignInNoSSR = dynamic(async () => (await import("@clerk/nextjs")).SignIn, {
  ssr: false,
})
const SignUpNoSSR = dynamic(async () => (await import("@clerk/nextjs")).SignUp, {
  ssr: false,
})
