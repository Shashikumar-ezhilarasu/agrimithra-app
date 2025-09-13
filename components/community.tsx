"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import {
  ArrowLeft,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Users,
  TrendingUp,
  Award,
  Camera,
  Send,
} from "lucide-react"

interface CommunityPost {
  id: string
  author: string
  avatar: string
  location: string
  timeAgo: string
  contentByLang: Record<string, string>
  image?: string
  likes: number
  comments: number
  isLiked: boolean
  category: "tip" | "question" | "success" | "alert"
}

const samplePosts: CommunityPost[] = [
  {
    id: "1",
    author: "Ravi Kumar",
    avatar: "/placeholder-user.jpg",
    location: "Kochi, Kerala",
    timeAgo: "2 hours ago",
    contentByLang: {
      en: "Great harvest this season! Used organic fertilizers and got 20% more yield than last year. Happy to share my experience with fellow farmers.",
      hi: "इस बार अच्छी फसल हुई! जैविक खाद का उपयोग किया और पिछले साल से 20% ज्यादा उत्पादन मिला। अपने अनुभव किसानों के साथ बाँटकर खुशी हो रही है।",
      ml: "ഈ സീസണിൽ നല്ല വിളവ് ലഭിച്ചു! ജൈവ വളം ഉപയോഗിച്ചതിനാൽ കഴിഞ്ഞ വർഷത്തേക്കാൾ 20% കൂടുതലായി വിളവ് കിട്ടി. സഹകർഷകരുമായി എന്റെ അനുഭവം പങ്കിടുന്നതിൽ സന്തോഷം.",
      ta: "இந்த பருவத்தில் நல்ல அறுவடை கிடைத்தது! இயற்கை உரம் பயன்படுத்தி, கடந்த ஆண்டைவிட 20% அதிக மகசூல் பெற்றேன். என் அனுபவத்தை விவசாயிகளுடன் பகிர்ந்து மகிழ்ச்சி.",
      te: "ఈ సీజన్‌లో మంచి పంట వచ్చింది! సేంద్రియ ఎరువులు వాడి గత ఏడాదికంటే 20% ఎక్కువ దిగుబడి వచ్చింది. నా అనుభవాన్ని రైతు మిత్రులతో పంచుకోవడం ఆనందంగా ఉంది."
    },
    image: "/rice-grains.jpg",
    likes: 24,
    comments: 8,
    isLiked: false,
    category: "success",
  },
  {
    id: "2",
    author: "Meera Devi",
    avatar: "/placeholder-user.jpg",
    location: "Palakkad, Kerala",
    timeAgo: "4 hours ago",
    contentByLang: {
      en: "Has anyone tried drip irrigation for tomatoes? Looking for advice on setup costs and water savings. Please share your experience!",
      hi: "क्या किसी ने टमाटर के लिए ड्रिप सिंचाई का उपयोग किया है? सेटअप खर्च और पानी की बचत पर सलाह चाहिए। कृपया अपना अनुभव साझा करें!",
      ml: "തക്കാളിക്ക് ഡ്രിപ്പ് ഇറിഗേഷൻ പരീക്ഷിച്ചവർ ഉണ്ടോ? സജ്ജീകരണ ചെലവും ജലസംരക്ഷണവും സംബന്ധിച്ച് ഉപദേശം വേണം. അനുഭവം പങ്കുവെയ്ക്കണേ!",
      ta: "தக்காளிக்கு ட்ரிப் பாசனம் செய்து பார்த்தவர்களா? அமைக்கும் செலவு, தண்ணீர் சேமிப்பு குறித்த ஆலோசனை வேண்டும். உங்கள் அனுபவத்தை பகிருங்கள்!",
      te: "టమోటాకు డ్రిప్ ఇరిగేషన్ వాడినవారు ఉన్నారా? సెటప్ ఖర్చు, నీటి ఆదా గురించి సూచనలు కావాలి. మీ అనుభవం చెప్పండి!"
    },
    likes: 12,
    comments: 15,
    isLiked: true,
    category: "question",
  },
  {
    id: "3",
    author: "Suresh Nair",
    avatar: "/placeholder-user.jpg",
    location: "Thrissur, Kerala",
    timeAgo: "1 day ago",
    contentByLang: {
      en: "Pro tip: Apply neem oil spray early morning for best pest control results. Avoid spraying during hot afternoon sun. Works great for my vegetable crops!",
      hi: "टिप: नीम का तेल सुबह जल्दी छिड़कें, कीट नियंत्रण में बेहतरीन असर होता है। दोपहर की तेज धूप में छिड़काव न करें। मेरी सब्जियों में बहुत अच्छा परिणाम मिला है!",
      ml: "ടിപ്പ്: വെളുപ്പിന് നേരത്തെ വേപ്പെണ്ണ സ്പ്രേ ചെയ്യുക, കീടനിയന്ത്രണത്തിന് ഏറ്റവും ഫലപ്രദം. ഉച്ചതിരിഞ്ഞ് ചൂടിൽ സ്പ്രേ ചെയ്യരുത്. എന്റെ പച്ചക്കറികളിൽ മികച്ച ഫലം കിട്ടി!",
      ta: "சிறப்பு குறிப்பு: காலையில் சீக்கிரம் வேப்பெண்ணெய் தெளித்தால் சிறந்த பூச்சி கட்டுப்பாடு கிடைக்கும். மதிய வெயிலில் தெளிக்க வேண்டாம். என் காய்கறிகளில் நல்ல பலன் கிடைத்தது!",
      te: "సలహా: ఉదయం తొందరగా వేప నూనె స్ప్రే చేస్తే కీటక నియంత్రణ బాగా జరుగుతుంది. మధ్యాహ్నం ఎండలో స్ప్రే చేయకండి. నా కూరగాయలకు చాలా మంచి ఫలితం వచ్చింది!"
    },
    likes: 31,
    comments: 6,
    isLiked: false,
    category: "tip",
  },
  {
    id: "4",
    author: "Krishnan Pillai",
    avatar: "/placeholder-user.jpg",
    location: "Wayanad, Kerala",
    timeAgo: "2 days ago",
    contentByLang: {
      en: "⚠️ Alert: Leaf blight spotted in rice crops in our area. Take preventive measures immediately. Contact agriculture officer for fungicide recommendations.",
      hi: "⚠️ सावधान: हमारे क्षेत्र में धान की फसल में पत्तों की झुलसा बीमारी देखी गई है। तुरंत बचाव के उपाय करें। फफूंदनाशी दवा के लिए कृषि अधिकारी से संपर्क करें।",
      ml: "⚠️ അലർട്ട്: നമ്മുടെ പ്രദേശത്തെ നെൽവയലുകളിൽ ഇല ബ്ലൈറ്റ് കണ്ടിട്ടുണ്ട്. ഉടൻ പ്രതിരോധ നടപടികൾ സ്വീകരിക്കുക. ഫംഗിസൈഡ് ശുപാർശയ്ക്കായി കൃഷി ഓഫീസറെ ബന്ധപ്പെടുക.",
      ta: "⚠️ எச்சரிக்கை: எங்கள் பகுதியில் நெல் வயலில் இலை நோய் (பிளைட்) கண்டறியப்பட்டுள்ளது. உடனே முன்னெச்சரிக்கை நடவடிக்கை எடுக்கவும். பூஞ்சை மருந்து ஆலோசனைக்கு விவசாய அதிகாரியை தொடர்பு கொள்ளவும்.",
      te: "⚠️ హెచ్చరిక: మా ప్రాంతంలోని వరి పంటలో ఆకు బ్లైట్ వ్యాధి కనిపించింది. వెంటనే జాగ్రత్త చర్యలు తీసుకోండి. ఫంగిసైడ్ సూచన కోసం వ్యవసాయ అధికారిని సంప్రదించండి."
    },
    likes: 18,
    comments: 12,
    isLiked: false,
    category: "alert",
  },
]

export function Community() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [posts, setPosts] = useState<CommunityPost[]>(samplePosts)
  const [newPost, setNewPost] = useState({ content: "", category: "question" as const })
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)

  const postsForLanguage = useMemo(() => {
    return posts.map((p) => ({
      ...p,
      // choose content for the selected language; fallback to English or first available
      content:
        p.contentByLang[language] ?? p.contentByLang.en ?? Object.values(p.contentByLang)[0] ?? "",
    }))
  }, [posts, language])

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: "You",
      avatar: "/placeholder-user.jpg",
      location: "Your Location",
      timeAgo: "Just now",
      contentByLang: {
        [language]: newPost.content,
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      category: newPost.category,
    }

    setPosts((prev) => [post, ...prev])
    setNewPost({ content: "", category: "question" })
    setIsPostDialogOpen(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "success":
        return "bg-green-100 text-green-800"
      case "question":
        return "bg-blue-100 text-blue-800"
      case "tip":
        return "bg-yellow-100 text-yellow-800"
      case "alert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "success":
        return <Award className="h-3 w-3" />
      case "question":
        return <MessageCircle className="h-3 w-3" />
      case "tip":
        return <TrendingUp className="h-3 w-3" />
      case "alert":
        return <Users className="h-3 w-3" />
      default:
        return <MessageCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/marketplace")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t("community")}</h1>
        </div>
      </div>

      {/* Community Stats */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">1,247</p>
            <p className="text-xs text-muted-foreground">Active Farmers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">3,891</p>
            <p className="text-xs text-muted-foreground">Posts Shared</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">892</p>
            <p className="text-xs text-muted-foreground">Questions Answered</p>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="p-4 space-y-4 pb-20">
  {postsForLanguage.map((post, index) => (
          <Card key={post.id} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                    <AvatarFallback>
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm">{post.author}</h3>
                      <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1 capitalize">{post.category}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.location} • {post.timeAgo}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-foreground mb-3 leading-relaxed">{(post as any).content}</p>

              {post.image && (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post image"
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Add Post Button */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>{t("shareExperience")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <div className="flex space-x-2 mt-2">
                {[
                  { id: "question", label: "Question", icon: MessageCircle },
                  { id: "tip", label: "Tip", icon: TrendingUp },
                  { id: "success", label: "Success", icon: Award },
                ].map((category) => (
                  <Button
                    key={category.id}
                    variant={newPost.category === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewPost({ ...newPost, category: category.id as any })}
                    className="flex-1"
                  >
                    <category.icon className="h-3 w-3 mr-1" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Share your experience</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What would you like to share with the farming community?"
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newPost.content.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
