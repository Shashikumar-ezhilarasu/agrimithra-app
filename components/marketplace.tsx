"use client"

import { useState, useMemo } from "react"
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
  ShieldCheck,
  Zap,
  Leaf,
  Droplet,
  Settings
} from "lucide-react"
import { MultiLanguageProductCard } from "@/components/ui/product-listing"

interface MarketplaceItem {
  id: string
  title: string
  price: string
  location: string
  seller: string
  image: string
  category: "crops" | "equipment" | "seeds" | "fertilizer" | "supplies"
  type: "buy" | "rent"
  description: string
  phone: string
  postedDate: string
  isLiked?: boolean
  rating?: number
  reviews?: number
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
    title: "Fresh Rice - Premium Jyothi",
    price: "₹2,100/qt",
    location: "Kochi, Kerala",
    seller: "Ravi Kumar",
    image: "/rice-grains.jpg",
    category: "crops",
    type: "buy",
    description: "High quality Jyothi rice, freshly harvested. Organic farming methods used. No chemical pesticides.",
    phone: "+91 9876543210",
    postedDate: "2h ago",
    rating: 4.8,
    reviews: 12,
  },
  {
    id: "2",
    title: "Swaraj 744 FE Tractor",
    price: "₹850/day",
    location: "Thrissur, Kerala",
    seller: "Suresh Nair",
    image: "/red-tractor.png",
    category: "equipment",
    type: "rent",
    description: "Excellent condition Swaraj tractor. Fuel efficient. Includes ploughing attachments. Operator available.",
    phone: "+91 9876543211",
    postedDate: "5h ago",
    rating: 4.9,
    reviews: 8,
  },
  {
    id: "3",
    title: "Organic Nendran Banana",
    price: "₹45/kg",
    location: "Palakkad, Kerala",
    seller: "Meera Devi",
    image: "/fresh-red-tomatoes.jpg",
    category: "crops",
    type: "buy",
    description: "Grade-A Nendran bananas, chemical-free. Perfect for making chips or direct consumption.",
    phone: "+91 9876543212",
    postedDate: "1h ago",
    isLiked: true,
  },
  {
    id: "4",
    title: "Hybrid Chilli Seeds - Teja",
    price: "₹450/pkt",
    location: "Wayanad, Kerala",
    seller: "Krishnan Pillai",
    image: "/corn-seeds.png",
    category: "seeds",
    type: "buy",
    description: "High pungency Teja chilli seeds. 90% germination rate. Resistant to leaf curl virus.",
    phone: "+91 9876543213",
    postedDate: "1d ago",
  },
  {
    id: "5",
    title: "Power Tiller - VST Shakti",
    price: "₹500/day",
    location: "Kottayam, Kerala",
    seller: "Thomas Chacko",
    image: "/power-tiller.jpg",
    category: "equipment",
    type: "rent",
    description: "13HP Power tiller for easy wetland preparation. Regularly serviced.",
    phone: "+91 9876543214",
    postedDate: "3h ago",
  },
  {
    id: "6",
    title: "Vermicompost - Pure Organic",
    price: "₹18/kg",
    location: "Idukki, Kerala",
    seller: "Green Earth Farms",
    image: "/vermicompost.jpg",
    category: "fertilizer",
    type: "buy",
    description: "High-grade vermicompost enriched with beneficial microbes. Increases soil fertility naturally.",
    phone: "+91 9876543215",
    postedDate: "12h ago",
  },
  {
    id: "7",
    title: "Drip Irrigation Kit - 1 Acre",
    price: "₹12,500/full kit",
    location: "Kochi, Kerala",
    seller: "AgriTech Solutions",
    image: "/drip-kit.jpg",
    category: "supplies",
    type: "buy",
    description: "Complete drip irrigation setup for 1 acre. Includes lateral pipes, emitters, and filter.",
    phone: "+91 9876543216",
    postedDate: "2d ago",
  },
  {
    id: "8",
    title: "Neem Oil Spray - Concentrated",
    price: "₹350/500ml",
    location: "Thrissur, Kerala",
    seller: "Organic Care",
    image: "/neem-oil.jpg",
    category: "fertilizer",
    type: "buy",
    description: "Cold-pressed neem oil for natural pest control. Effective against aphids and mites.",
    phone: "+91 9876543217",
    postedDate: "6h ago",
  }
]

const categories = [
  { id: "all", label: "All Items", icon: Settings },
  { id: "crops", label: "Crops", icon: Leaf },
  { id: "equipment", label: "Tools", icon: Tractor },
  { id: "seeds", label: "Seeds", icon: Wheat },
  { id: "fertilizer", label: "Organic", icon: Droplet },
  { id: "supplies", label: "Agri-Tech", icon: Zap },
]

export function Marketplace() {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [items, setItems] = useState<MarketplaceItem[]>(sampleItems)
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Use useMemo for filtering to improve performance
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = item.type === activeTab
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      return matchesTab && matchesSearch && matchesCategory
    })
  }, [items, activeTab, searchQuery, selectedCategory])

  const handleLike = (itemId: string) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, isLiked: !item.isLiked } : item)))
  }

  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    location: "",
    category: "crops",
    type: "buy",
    description: "",
    phone: "",
  })

  const handlePostItem = () => {
    const item: MarketplaceItem = {
      id: Date.now().toString(),
      ...newItem,
      seller: "You",
      image: "/farming-product.jpg",
      postedDate: "Just now",
    } as any
    setItems((prev) => [item, ...prev])
    setIsPostDialogOpen(false)
    setNewItem({
        title: "",
        price: "",
        location: "",
        category: "crops",
        type: "buy",
        description: "",
        phone: "",
    })
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/60 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="rounded-full">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Agri<span className="text-emerald-600">Market</span></h1>
            </div>
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-2xl w-48">
              <button 
                onClick={() => setActiveTab("buy")}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'buy' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
              >
                Market
              </button>
              <button 
                onClick={() => setActiveTab("rent")}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'rent' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
              >
                Hire
              </button>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Search seeds, tractors, or fertilizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-slate-50 border-none rounded-2xl focus-visible:ring-emerald-500/20 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="bg-white border-b border-slate-100 overflow-x-auto no-scrollbar py-4 px-4">
        <div className="max-w-4xl mx-auto flex space-x-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all border ${
                selectedCategory === cat.id 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm' 
                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <cat.icon className={`h-4 w-4 ${selectedCategory === cat.id ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pb-28">
        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Verified Listings</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{filteredItems.length} Products Found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item, index) => (
              <Card key={item.id} className="bg-white border-none shadow-2xl shadow-emerald-900/5 rounded-[2rem] overflow-hidden group hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-md text-emerald-600 border-none font-black text-[10px] uppercase px-3 py-1 rounded-xl shadow-lg">
                           {item.category}
                        </Badge>
                    </div>
                    <button 
                      onClick={() => handleLike(item.id)}
                      className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg group/btn active:scale-90 transition-all"
                    >
                        <Heart className={`h-4 w-4 transition-colors ${item.isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/btn:text-red-400'}`} />
                    </button>
                    <div className="absolute bottom-4 right-4">
                        <div className="bg-emerald-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl">
                            {item.price}
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tighter">{item.title}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4 opacity-50">
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-wider">{item.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-wider">{item.postedDate}</span>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium line-clamp-2">
                        {item.description}
                    </p>

                    <div className="flex space-x-2">
                        <Button 
                          onClick={() => window.open(`tel:${item.phone}`)}
                          className="flex-1 bg-slate-900 hover:bg-black text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
                        >
                            <Phone className="h-3 w-3 mr-2" />
                            Contact
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-slate-100 hover:bg-slate-50 text-slate-600 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
                        >
                            <MessageCircle className="h-3 w-3 mr-2 text-emerald-500" />
                            Chat
                        </Button>
                    </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center opacity-40">
             <Search className="h-12 w-12 mx-auto mb-4" />
             <p className="text-xs font-black uppercase tracking-[0.2em]">No products found in this path</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-24 right-6 h-16 w-16 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-200 transition-all duration-300 transform hover:scale-110 group z-40"
            >
              <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform" />
              <span className="absolute -top-12 right-0 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Sell Item</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto rounded-[3rem] border-none shadow-2xl p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black text-slate-800 tracking-tighter underline decoration-emerald-500 decoration-4 underline-offset-4">Post Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Item Title</Label>
                <Input value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} placeholder="e.g. Sonalika Tractor" className="h-12 bg-slate-50 border-none rounded-2xl font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Price</Label>
                    <Input value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} placeholder="₹ / Unit" className="h-12 bg-slate-50 border-none rounded-2xl font-bold" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Category</Label>
                    <Select onValueChange={(v) => setNewItem({...newItem, category: v as any})}>
                        <SelectTrigger className="h-12 bg-slate-50 border-none rounded-2xl font-bold">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="crops">Crops</SelectItem>
                             <SelectItem value="equipment">Equipment</SelectItem>
                             <SelectItem value="seeds">Seeds</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Description</Label>
                <Textarea value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} placeholder="Tell us about the quality..." className="bg-slate-50 border-none rounded-3xl p-5 font-medium" rows={3}/>
              </div>
              <Button onClick={handlePostItem} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 mt-4">
                <Send className="h-4 w-4 mr-2" />
                Launch Listing
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
