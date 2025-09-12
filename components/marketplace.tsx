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
              <Card
                key={item.id}
                className="bg-card hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-border"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge
                      className={`absolute top-2 left-2 ${item.type === "buy" ? "bg-primary" : "bg-accent"} text-white`}
                    >
                      {item.type === "buy" ? "For Sale" : "For Rent"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(item.id)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart
                        className={`h-4 w-4 ${item.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1">{item.title}</h3>
                        <p className="text-lg font-bold text-primary">{item.price}</p>
                      </div>
                      <div className="flex items-center text-muted-foreground">{getCategoryIcon(item.category)}</div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        By {item.seller} • {item.postedDate}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent border-border">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
