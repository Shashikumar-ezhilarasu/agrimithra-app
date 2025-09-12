"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const translations = {
  en: {
  geminiOverloaded: "Gemini is overloaded. Retrying...",
  cropDiseaseAnalysis: "Crop disease analysis",
  currentMarketPrices: "Current market prices",
  weatherForecast: "Weather forecast",
  governmentSchemes: "Government schemes",
  fertilizerRecommendations: "Fertilizer recommendations",
  pestControlMethods: "Pest control methods",
  aiWelcome: "🌾 Hello! I'm your AgriMithra AI assistant. I can help you with:\n\n• 📸 Image Analysis - Crop disease detection\n• 🎤 Voice Queries - Natural language farming questions\n• 🎥 Video Analysis - Field assessment and techniques\n• 📱 NFC Data - Smart tag information\n\nHow can I help you today?",
  aboutAgriMithraDesc: "Made for SIH 2025. By Students of SRM.",
  version: "Version",
  lastUpdated: "Last Updated",
  developer: "Developer",
  developerName: "SRM Students",
    // Navigation
    dashboard: "Dashboard",
    marketplace: "Marketplace",
    profile: "Profile",
    chat: "AI Chat",

    // Dashboard
  // welcome key removed (duplicate)
    askQuestion: "Ask your farming question",
    voiceInput: "Voice Input",
    textQuery: "Text Query",
    photoAnalysis: "Photo Analysis",
    nfcScan: "NFC Scan",
    marketPrices: "Market Prices",
    govtSchemes: "Govt Schemes",
    diseaseAlerts: "Disease Alerts",

    // Marketplace
    buy: "Buy",
    rent: "Rent",
    community: "Community",
    searchProducts: "Search products...",
    postNewItem: "Post New Item",

  // Profile
  settings: "Settings",
  notifications: "Notifications",
  logout: "Logout",

    // AI Chat
    listening: "Listening...",
    typing: "Typing...",
    askFarmingQuestion: "Ask your farming question...",

  // Community
  communityPosts: "Community Posts",
  shareExperience: "Share Experience",
  askCommunity: "Ask Community",
  farmingTips: "Farming Tips",
  discussions: "Discussions",

  // Auth Page
  languageSettings: "Select Language",
  welcome: "Welcome to AgriMithra",
  verifyNumber: "Verify Your Number",
  enterPhoneToStart: "Enter your phone number to get started",
  sentCodeTo: "We sent a code to",
  phoneNumber: "Phone Number",
  enterPhone: "Enter your phone number",
  sending: "Sending...",
  sendOTP: "Send OTP",
  or: "OR",
  signingIn: "Signing in...",
  continueWithGoogle: "Continue with Google",
  enterOTP: "Enter OTP",
  enterOTPPlaceholder: "Enter 6-digit code",
  verifying: "Verifying...",
  verifyAndContinue: "Verify & Continue",
  changePhone: "Change Phone Number",
  termsAndPrivacy: "By continuing, you agree to our Terms of Service and Privacy Policy",
  },
  hi: {
  geminiOverloaded: "Gemini सेवा व्यस्त है। पुनः प्रयास किया जा रहा है...",
  cropDiseaseAnalysis: "फसल रोग विश्लेषण",
  currentMarketPrices: "वर्तमान बाजार मूल्य",
  weatherForecast: "मौसम पूर्वानुमान",
  governmentSchemes: "सरकारी योजनाएं",
  fertilizerRecommendations: "उर्वरक सिफारिशें",
  pestControlMethods: "कीट नियंत्रण विधियाँ",
  aiWelcome: "🌾 नमस्ते! मैं आपका AgriMithra एआई सहायक हूँ। मैं आपकी मदद कर सकता हूँ:\n\n• 📸 चित्र विश्लेषण - फसल रोग पहचान\n• 🎤 वॉयस प्रश्न - प्राकृतिक भाषा में खेती से जुड़े सवाल\n• 🎥 वीडियो विश्लेषण - खेत का मूल्यांकन और तकनीकें\n• 📱 एनएफसी डेटा - स्मार्ट टैग जानकारी\n\nमैं आपकी किस प्रकार सहायता कर सकता हूँ?",
  aboutAgriMithraDesc: "SIH 2025 के लिए बनाया गया। SRM के छात्रों द्वारा।",
  version: "संस्करण",
  lastUpdated: "अंतिम अपडेट",
  developer: "डेवलपर",
  developerName: "SRM छात्र",
    // Navigation
    dashboard: "डैशबोर्ड",
    marketplace: "बाज़ार",
    profile: "प्रोफ़ाइल",
    chat: "AI चैट",

    // Dashboard
  // welcome key removed (duplicate)
    askQuestion: "अपना कृषि प्रश्न पूछें",
    voiceInput: "आवाज़ इनपुट",
    textQuery: "टेक्स्ट प्रश्न",
    photoAnalysis: "फोटो विश्लेषण",
    nfcScan: "NFC स्कैन",
    marketPrices: "बाज़ार दर",
    govtSchemes: "सरकारी योजनाएं",
    diseaseAlerts: "रोग चेतावनी",

    // Marketplace
    buy: "खरीदें",
    rent: "किराया",
    community: "समुदाय",
    searchProducts: "उत्पाद खोजें...",
    postNewItem: "नया आइटम पोस्ट करें",

  // Profile
  settings: "सेटिंग्स",
  notifications: "सूचनाएं",
  logout: "लॉगआउट",

    // AI Chat
    listening: "सुन रहा है...",
    typing: "टाइप कर रहा है...",
    askFarmingQuestion: "अपना कृषि प्रश्न पूछें...",

  // Community
  communityPosts: "समुदायिक पोस्ट",
  shareExperience: "अनुभव साझा करें",
  askCommunity: "समुदाय से पूछें",
  farmingTips: "कृषि सुझाव",
  discussions: "चर्चा",

  // Auth Page
  languageSettings: "भाषा चुनें",
  welcome: "AgriMithra में आपका स्वागत है",
  verifyNumber: "अपना नंबर सत्यापित करें",
  enterPhoneToStart: "शुरू करने के लिए अपना फ़ोन नंबर दर्ज करें",
  sentCodeTo: "हमने कोड भेजा है",
  phoneNumber: "फ़ोन नंबर",
  enterPhone: "अपना फ़ोन नंबर दर्ज करें",
  sending: "भेजा जा रहा है...",
  sendOTP: "OTP भेजें",
  or: "या",
  signingIn: "साइन इन हो रहा है...",
  continueWithGoogle: "Google से जारी रखें",
  enterOTP: "OTP दर्ज करें",
  enterOTPPlaceholder: "6-अंकों का कोड दर्ज करें",
  verifying: "सत्यापित हो रहा है...",
  verifyAndContinue: "सत्यापित करें और जारी रखें",
  changePhone: "फ़ोन नंबर बदलें",
  termsAndPrivacy: "जारी रखते हुए, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं",
  },
  ta: {
  geminiOverloaded: "Gemini அதிக பணி காரணமாக பதில் தர முடியவில்லை. மீண்டும் முயற்சிக்கிறது...",
  cropDiseaseAnalysis: "பயிர் நோய் பகுப்பாய்வு",
  currentMarketPrices: "தற்போதைய சந்தை விலைகள்",
  weatherForecast: "வானிலை முன்னறிவு",
  governmentSchemes: "அரசு திட்டங்கள்",
  fertilizerRecommendations: "உர பரிந்துரைகள்",
  pestControlMethods: "பூச்சி கட்டுப்பாட்டு முறைகள்",
  aiWelcome: "🌾 வணக்கம்! நான் உங்கள் AgriMithra AI உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n\n• 📸 படப் பகுப்பாய்வு - பயிர் நோய் கண்டறிதல்\n• 🎤 குரல் கேள்விகள் - இயற்கை மொழியில் விவசாய கேள்விகள்\n• 🎥 வீடியோ பகுப்பாய்வு - வயல் மதிப்பீடு மற்றும் நுட்பங்கள்\n• 📱 NFC தரவு - ஸ்மார்ட் டேக் தகவல்\n\nநான் எப்படி உதவலாம்?",
  aboutAgriMithraDesc: "SIH 2025-க்கு உருவாக்கப்பட்டது. SRM மாணவர்களால்.",
  version: "பதிப்பு",
  lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
  developer: "டெவலப்பர்",
  developerName: "SRM மாணவர்கள்",
  // Auth Page
  languageSettings: "மொழியை தேர்ந்தெடுக்கவும்",
  welcome: "AgriMithra-க்கு வரவேற்கிறோம்",
  verifyNumber: "உங்கள் எண்ணை சரிபார்க்கவும்",
  enterPhoneToStart: "தொடங்க உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",
  sentCodeTo: "நாங்கள் குறியீட்டை அனுப்பியுள்ளோம்",
  phoneNumber: "தொலைபேசி எண்",
  enterPhone: "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",
  sending: "அனுப்புகிறது...",
  sendOTP: "OTP அனுப்பவும்",
  or: "அல்லது",
  signingIn: "உள்நுழைகிறது...",
  continueWithGoogle: "Google மூலம் தொடரவும்",
  enterOTP: "OTP உள்ளிடவும்",
  enterOTPPlaceholder: "6-எண் குறியீட்டை உள்ளிடவும்",
  verifying: "சரிபார்க்கிறது...",
  verifyAndContinue: "சரிபார்த்து தொடரவும்",
  changePhone: "தொலைபேசி எண்ணை மாற்றவும்",
  termsAndPrivacy: "தொடர்ந்தால், நீங்கள் எங்கள் சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஒப்புக்கொள்கிறீர்கள்",
    // Navigation
    dashboard: "டாஷ்போர்டு",
    marketplace: "சந்தை",
    profile: "சுயவிவரம்",
    chat: "AI அரட்டை",

    // Dashboard
  // welcome key removed (duplicate)
    askQuestion: "உங்கள் விவசாய கேள்வியை கேளுங்கள்",
    voiceInput: "குரல் உள்ளீடு",
    textQuery: "உரை கேள்வி",
    photoAnalysis: "புகைப்பட பகுப்பாய்வு",
    nfcScan: "NFC ஸ்கேன்",
    marketPrices: "சந்தை விலைகள்",
    govtSchemes: "அரசு திட்டங்கள்",
    diseaseAlerts: "நோய் எச்சரிக்கை",

    // Marketplace
    buy: "வாங்க",
    rent: "வாடகை",
    community: "சமூகம்",
    searchProducts: "பொருட்களை தேடுங்கள்...",
    postNewItem: "புதிய பொருள் பதிவிடுங்கள்",

  // Profile
  settings: "அமைப்புகள்",
  notifications: "அறிவிப்புகள்",
  logout: "வெளியேறு",

    // AI Chat
    listening: "கேட்கிறது...",
    typing: "தட்டுகிறது...",
    askFarmingQuestion: "உங்கள் விவசாய கேள்வியை கேளுங்கள்...",

    // Community
    communityPosts: "சமூக பதிவுகள்",
    shareExperience: "அனுபவத்தை பகிரவும்",
    askCommunity: "சமூகத்திடம் கேளுங்கள்",
    farmingTips: "விவசாய குறிப்புகள்",
    discussions: "விவாதங்கள்",
  },
  ml: {
  geminiOverloaded: "Gemini ഓവർലോഡ് ആണ്. വീണ്ടും ശ്രമിക്കുന്നു...",
  cropDiseaseAnalysis: "വള രോഗ വിശകലനം",
  currentMarketPrices: "നിലവിലെ മാർക്കറ്റ് വിലകൾ",
  weatherForecast: "വാതാവര പ്രവചനം",
  governmentSchemes: "സർക്കാർ പദ്ധതികൾ",
  fertilizerRecommendations: "വള ശുപാർശകൾ",
  pestControlMethods: "കീട നിയന്ത്രണ രീതികൾ",
  aiWelcome: "🌾 നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AgriMithra AI സഹായി. ഞാൻ നിങ്ങളെ സഹായിക്കാൻ കഴിയും:\n\n• 📸 ചിത്ര വിശകലനം - വിള രോഗ നിർണയം\n• 🎤 ശബ്ദ ചോദ്യങ്ങൾ - സ്വാഭാവിക ഭാഷയിൽ കൃഷി ചോദ്യങ്ങൾ\n• 🎥 വീഡിയോ വിശകലനം - വയൽ മൂല്യനിർണയം, സാങ്കേതിക വിദ്യകൾ\n• 📱 എൻഎഫ്സി ഡാറ്റ - സ്മാർട്ട് ടാഗ് വിവരം\n\nഞാൻ എങ്ങനെ സഹായിക്കാം?",
  aboutAgriMithraDesc: "SIH 2025-ന് വേണ്ടി നിർമ്മിച്ചത്. SRM വിദ്യാർത്ഥികൾ നിർമ്മിച്ചത്.",
  version: "പതിപ്പ്",
  lastUpdated: "അവസാനമായി പുതുക്കിയത്",
  developer: "ഡെവലപ്പർ",
  developerName: "SRM വിദ്യാർത്ഥികൾ",
  // Auth Page
  languageSettings: "ഭാഷ തിരഞ്ഞെടുക്കുക",
  welcome: "AgriMithra-യിലേക്ക് സ്വാഗതം",
  verifyNumber: "നിങ്ങളുടെ നമ്പർ സ്ഥിരീകരിക്കുക",
  enterPhoneToStart: "തുടങ്ങാൻ നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക",
  sentCodeTo: "നാം കോഡ് അയച്ചിട്ടുണ്ട്",
  phoneNumber: "ഫോൺ നമ്പർ",
  enterPhone: "നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക",
  sending: "അയയ്ക്കുന്നു...",
  sendOTP: "OTP അയയ്ക്കുക",
  or: "അല്ലെങ്കിൽ",
  signingIn: "സൈൻ ഇൻ ചെയ്യുന്നു...",
  continueWithGoogle: "Google ഉപയോഗിച്ച് തുടരുക",
  enterOTP: "OTP നൽകുക",
  enterOTPPlaceholder: "6-അങ്കം കോഡ് നൽകുക",
  verifying: "സ്ഥിരീകരിക്കുന്നു...",
  verifyAndContinue: "സ്ഥിരീകരിച്ച് തുടരുക",
  changePhone: "ഫോൺ നമ്പർ മാറ്റുക",
  termsAndPrivacy: "തുടരുമ്പോൾ, നിങ്ങൾ ഞങ്ങളുടെ സേവന നിബന്ധനകളും സ്വകാര്യതാ നയവും അംഗീകരിക്കുന്നു",
    // Navigation
    dashboard: "ഡാഷ്ബോർഡ്",
    marketplace: "ചന്ത",
    profile: "പ്രൊഫൈൽ",
    chat: "AI ചാറ്റ്",

    // Dashboard
  // welcome key removed (duplicate)
    askQuestion: "നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾ ചോദിക്കുക",
    voiceInput: "ശബ്ദ ഇൻപുട്ട്",
    textQuery: "ടെക്സ്റ്റ് ചോദ്യം",
    photoAnalysis: "ഫോട്ടോ വിശകലനം",
    nfcScan: "NFC സ്കാൻ",
    marketPrices: "ചന്ത വിലകൾ",
    govtSchemes: "സർക്കാർ പദ്ധതികൾ",
    diseaseAlerts: "രോഗ മുന്നറിയിപ്പ്",

    // Marketplace
    buy: "വാങ്ങുക",
    rent: "വാടക",
    community: "സമൂഹം",
    searchProducts: "ഉൽപ്പന്നങ്ങൾ തിരയുക...",
    postNewItem: "പുതിയ ഉൽപ്പന്നം പോസ്റ്റ് ചെയ്യുക",

  // Profile
  settings: "ക്രമീകരണങ്ങൾ",
  notifications: "അറിയിപ്പുകൾ",
  logout: "ലോഗ്ഔട്ട്",

    // AI Chat
    listening: "കേൾക്കുന്നു...",
    typing: "ടൈപ്പ് ചെയ്യുന്നു...",
    askFarmingQuestion: "നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾ ചോദിക്കുക...",

    // Community
    communityPosts: "സമൂഹ പോസ്റ്റുകൾ",
    shareExperience: "അനുഭവം പങ്കിടുക",
    askCommunity: "സമൂഹത്തോട് ചോദിക്കുക",
    farmingTips: "കൃഷി ടിപ്പുകൾ",
    discussions: "ചർച്ചകൾ",
  },
  kn: {
    // Navigation
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    marketplace: "ಮಾರುಕಟ್ಟೆ",
    profile: "ಪ್ರೊಫೈಲ್",
    chat: "AI ಚಾಟ್",

    // Dashboard
    welcome: "AgriMithra ಗೆ ಸ್ವಾಗತ",
    askQuestion: "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ",
    voiceInput: "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
    textQuery: "ಪಠ್ಯ ಪ್ರಶ್ನೆ",
    photoAnalysis: "ಫೋಟೋ ವಿಶ್ಲೇಷಣೆ",
    nfcScan: "NFC ಸ್ಕ್ಯಾನ್",
    marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    govtSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    diseaseAlerts: "ರೋಗ ಎಚ್ಚರಿಕೆಗಳು",

    // Marketplace
    buy: "ಖರೀದಿಸಿ",
    rent: "ಬಾಡಿಗೆ",
    community: "ಸಮುದಾಯ",
    searchProducts: "ಉತ್ಪಾದನೆಗಳನ್ನು ಹುಡುಕಿ...",
    postNewItem: "ಹೊಸ ಐಟಂ ಪೋಸ್ಟ್ ಮಾಡಿ",

    // Profile
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    languageSettings: "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    logout: "ಲಾಗ್‌ಔಟ್",

    // AI Chat
    listening: "ಕೇಳುತ್ತಿದೆ...",
    typing: "ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
    askFarmingQuestion: "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...",

    // Community
    communityPosts: "ಸಮುದಾಯ ಪೋಸ್ಟ್‌ಗಳು",
    shareExperience: "ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ",
    askCommunity: "ಸಮುದಾಯವನ್ನು ಕೇಳಿ",
    farmingTips: "ಕೃಷಿ ಸಲಹೆಗಳು",
    discussions: "ಚರ್ಚೆಗಳು",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("agrimithra-language")
    if (savedLanguage && savedLanguage in translations) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("agrimithra-language", lang)
  }

  const t = (key: string): string => {
    const translation = translations[language as keyof typeof translations]
    return translation?.[key as keyof typeof translation] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
