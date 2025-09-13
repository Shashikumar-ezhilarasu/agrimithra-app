"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, MapPin, Heart } from "lucide-react"

interface ProductListing {
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

interface MultiLanguageProductProps {
  product: ProductListing
  onClickContact?: () => void
  onClickChat?: () => void
}

export function MultiLanguageProductCard({ product, onClickContact, onClickChat }: MultiLanguageProductProps) {
  const { language, t } = useLanguage()
  const [liked, setLiked] = useState(product.isLiked || false)
  
  // Update liked state when product.isLiked changes
  useEffect(() => {
    setLiked(product.isLiked || false);
  }, [product.isLiked]);

  // Get translated content or use default if no translation available
  const title = product.translations?.[language]?.title || product.title
  const description = product.translations?.[language]?.description || product.description

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={title} 
          className="w-full h-48 object-cover" 
        />
        <Badge 
          className="absolute top-2 left-2" 
          variant={product.type === "buy" ? "default" : "secondary"}
        >
          {product.type === "buy" ? t("buy") : t("rent")}
        </Badge>
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-2 right-2 rounded-full bg-white ${
            liked ? "text-red-500" : "text-gray-500"
          }`}
          onClick={() => setLiked(!liked)}
        >
          <Heart className={liked ? "fill-current" : ""} size={18} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl font-bold text-primary mt-1">{product.price}</p>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          <MapPin size={14} className="mr-1" />
          {product.location}
        </p>
        <p className="text-sm mt-2">{description}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500">
            {t("by")} {product.seller} • {product.postedDate}
          </p>
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onClickContact}
          >
            <Phone size={16} className="mr-1" /> {t("call")}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={onClickChat}
          >
            <MessageCircle size={16} className="mr-1" /> {t("chatAction")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
