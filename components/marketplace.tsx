"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  Camera,
  Wheat,
  Tractor,
  Users,
} from "lucide-react"
import { MultiLanguageProductCard } from "@/components/ui/product-listing"

interface MarketplaceItem {
  id: string
  title: string
  price: string
  location: string
  seller: string
  image: string
  category: "crops" | "equipment" | "seeds" | "fertilizer"
  type: "buy" | "rent"
  description: string
  phone: string
  postedDate: string
  isLiked?: boolean
  translations?: {
    [lang: string]: {
      title: string
      description: string
    }
  }
}

const sampleItems: MarketplaceItem[] = [
  {
    id: "1",
    title: "Fresh Rice - Premium Quality",
    price: "₹2,100/quintal",
    location: "Kochi, Kerala",
    seller: "Ravi Kumar",
    image: "/rice-grains.jpg",
    category: "crops",
    type: "buy",
    description: "High quality basmati rice, freshly harvested. Organic farming methods used.",
    phone: "+91 9876543210",
    postedDate: "2 days ago",
    translations: {
      hi: {
        title: "ताज़ा चावल - प्रीमियम गुणवत्ता",
        description: "उच्च गुणवत्ता वाला बासमती चावल, ताज़ा कटाई किया गया। जैविक खेती के तरीके अपनाए गए।"
      },
      ta: {
        title: "புதிய அரிசி - உயர் தரம்",
        description: "உயர் தர பாஸ்மதி அரிசி, புதியதாக அறுவடை செய்யப்பட்டது. இயற்கை வேளாண்மை முறைகள் பயன்படுத்தப்பட்டுள்ளன."
      },
      ml: {
        title: "പുതിയ അരി - പ്രീമിയം ഗുണമേന്മ",
        description: "ഉയർന്ന ഗുണമേന്മയുള്ള ബാസ്മതി അരി, പുതുതായി കൊയ്തെടുത്തത്. ജൈവ കൃഷി രീതികൾ ഉപയോഗിച്ചിട്ടുണ്ട്."
      },
      te: {
        title: "తాజా బియ్యం - ప్రీమియం నాణ్యత",
        description: "అత్యున్నత నాణ్యత గల బాస్మతి బియ్యం, తాజాగా కోయబడింది. సేంద్రియ వ్యవసాయ పద్ధతులు ఉపయోగించబడ్డాయి."
      }
    }
  },
  {
    id: "2",
    title: "Tractor for Rent - Mahindra 575",
    price: "₹800/day",
    location: "Thrissur, Kerala",
    seller: "Suresh Nair",
    image: "/red-tractor.png",
    category: "equipment",
    type: "rent",
    description: "Well-maintained tractor available for daily rent. Includes operator if needed.",
    phone: "+91 9876543211",
    postedDate: "1 day ago",
    translations: {
      hi: {
        title: "किराये पर ट्रैक्टर - महिंद्रा 575",
        description: "अच्छी तरह से मेंटेन किया गया ट्रैक्टर दैनिक किराये पर उपलब्ध। आवश्यकता होने पर ऑपरेटर सहित।"
      },
      ta: {
        title: "வாடகைக்கு டிராக்டர் - மஹிந்திரா 575",
        description: "நன்கு பராமரிக்கப்பட்ட டிராக்டர் தினசரி வாடகைக்கு கிடைக்கும். தேவையெனில் ஓட்டுநர் உடன் வழங்கப்படும்."
      },
      ml: {
        title: "ട്രാക്ടർ വാടകയ്ക്ക് - മഹീന്ദ്ര 575",
        description: "നന്നായി പരിപാലിച്ച ട്രാക്ടർ ദിവസവാടകയ്ക്ക് ലഭ്യമാണ്. ആവശ്യമെങ്കിൽ ഡ്രൈവർ ഉൾപ്പെടും."
      },
      te: {
        title: "అద్దెకు ట్రాక్టర్ - మహీంద్రా 575",
        description: "బాగా సంరక్షించిన ట్రాక్టర్ రోజువారీ అద్దెకు అందుబాటులో ఉంది. అవసరమైతే డ్రైవర్ సహా."
      }
    }
  },
  {
    id: "3",
    title: "Organic Tomatoes - Bulk Sale",
    price: "₹25/kg",
    location: "Palakkad, Kerala",
    seller: "Meera Devi",
    image: "/fresh-red-tomatoes.jpg",
    category: "crops",
    type: "buy",
    description: "Fresh organic tomatoes, perfect for wholesale buyers. Minimum order 100kg.",
    phone: "+91 9876543212",
    postedDate: "3 hours ago",
    isLiked: true,
    translations: {
      hi: {
        title: "ऑर्गेनिक टमाटर - थोक बिक्री",
        description: "ताज़े ऑर्गेनिक टमाटर, थोक खरीदारों के लिए उत्तम। न्यूनतम ऑर्डर 100 किलो।"
      },
      ta: {
        title: "ஆர்கானிக் தக்காளி - மொத்த விற்பனை",
        description: "புதிய இயற்கை தக்காளிகள், மொத்தமாக வாங்குபவர்களுக்கு சிறந்தது. குறைந்தபட்ச ஆர்டர் 100 கிலோ."
      },
      ml: {
        title: "ഓർഗാനിക് തക്കാളി - മൊത്തവില്പന",
        description: "പുതിയ ഓർഗാനിക് തക്കാളി, മൊത്തവ്യാപാരികൾക്ക് അനുയോജ്യം. കുറഞ്ഞത് 100 കിലോ ഓർഡർ വേണം."
      },
      te: {
        title: "ఆర్గానిక్ టమోటాలు - బల్క్ సేల్",
        description: "తాజా ఆర్గానిక్ టమోటాలు, హోల్‌సేల్ కొనుగోలుదారులకు అనువైనవి. కనీస ఆర్డర్ 100 కిలోలు."
      }
    }
  },
  {
    id: "4",
    title: "Hybrid Corn Seeds",
    price: "₹450/kg",
    location: "Wayanad, Kerala",
    seller: "Krishnan Pillai",
    image: "/corn-seeds.png",
    category: "seeds",
    type: "buy",
    description: "High yield hybrid corn seeds with 85% germination rate. Disease resistant variety.",
    phone: "+91 9876543213",
    postedDate: "1 week ago",
    translations: {
      hi: {
        title: "हाइब्रिड मक्का बीज",
        description: "85% अंकुरण दर वाले उच्च उपज हाइब्रिड मक्का बीज। रोग प्रतिरोधी किस्म।"
      },
      ta: {
        title: "இணை வகை சோளம் விதைகள்",
        description: "85% முளைத்தளவு கொண்ட அதிக மகசூல் தரும் இணை வகை சோளம் விதைகள். நோய் எதிர்ப்பு கொண்ட சிறப்பு வகை."
      },
      ml: {
        title: "ഹൈബ്രിഡ് ചോളം വിത്തുകൾ",
        description: "85% മുളയ്ക്കൽ ശേഷിയുള്ള ഉയർന്ന വിളവെടുപ്പ് ഹൈബ്രിഡ് ചോളം വിത്തുകൾ. രോഗപ്രതിരോധ ശേഷിയുള്ള ഇനം."
      },
      te: {
        title: "హైబ్రిడ్ మొక్కజొన్న విత్తనాలు",
        description: "85% మొలక శాతం కలిగిన అధిక దిగుబడి హైబ్రిడ్ మొక్కజొన్న విత్తనాలు. రోగనిరోధక రకం."
      }
    }
  },
]

export function Marketplace() {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "community">("buy")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [items, setItems] = useState<MarketplaceItem[]>(sampleItems)
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)

  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    location: "",
    category: "crops",
    type: "buy",
    description: "",
    phone: "",
  })

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "community" || item.type === activeTab
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesTab && matchesSearch && matchesCategory
  })

  const handleLike = (itemId: string) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, isLiked: !item.isLiked } : item)))
  }

  const handlePostItem = () => {
    const item: MarketplaceItem = {
      id: Date.now().toString(),
      ...newItem,
      seller: "You",
      image: "/farming-product.jpg",
      postedDate: "Just now",
    }
    setItems((prev) => [item, ...prev])
    setNewItem({
      title: "",
      price: "",
      location: "",
      category: "crops",
      type: "buy",
      description: "",
      phone: "",
    })
    setIsPostDialogOpen(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "crops":
        return <Wheat className="h-4 w-4" />
      case "equipment":
        return <Tractor className="h-4 w-4" />
      default:
        return <Wheat className="h-4 w-4" />
    }
  }

  const handleCommunityClick = () => {
    router.push("/community")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t("marketplace")}</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {[
            { id: "buy", label: t("buy"), icon: Wheat },
            { id: "rent", label: t("rent"), icon: Tractor },
            { id: "community", label: t("community"), icon: Users },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                if (tab.id === "community") {
                  handleCommunityClick()
                } else {
                  setActiveTab(tab.id as any)
                }
              }}
              className={`flex-1 ${activeTab === tab.id ? "bg-primary text-primary-foreground" : ""}`}
            >
              <tab.icon className="h-4 w-4 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchProducts")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="crops">Crops</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="seeds">Seeds</SelectItem>
              <SelectItem value="fertilizer">Fertilizer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="p-4 pb-20">
        {activeTab === "community" ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Community Features</h3>
            <p className="text-muted-foreground">Connect with fellow farmers, share experiences, and learn together.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                className="animate-fadeIn"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <MultiLanguageProductCard
                  product={{
                    ...item,
                    isLiked: item.isLiked
                  }}
                  onClickContact={() => window.alert(`Calling ${item.phone}`)}
                  onClickChat={() => window.alert(`Chat with ${item.seller}`)}
                />
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && activeTab !== "community" && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {activeTab !== "community" && (
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
              <DialogTitle>{t("postNewItem")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter item title"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="₹ 0"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crops">Crops</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="seeds">Seeds</SelectItem>
                      <SelectItem value="fertilizer">Fertilizer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newItem.type}
                    onValueChange={(value) => setNewItem({ ...newItem, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Describe your item..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newItem.phone}
                  onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <Button
                onClick={handlePostItem}
                disabled={!newItem.title || !newItem.price}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Camera className="h-4 w-4 mr-2" />
                Post Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
