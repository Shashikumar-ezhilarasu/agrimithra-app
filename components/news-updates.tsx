"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Share2, ExternalLink } from "lucide-react"

export function NewsUpdates() {
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => {
        setUpdates(data)
        setLoading(false)
      })
      .catch(err => console.error("Error fetching news", err))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {updates.map((item) => (
        <Card key={item.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
          <CardContent className="p-0 flex">
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={`text-[8px] font-black uppercase px-2 py-0 ${
                    item.type === 'scheme' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {item.type}
                </Badge>
                <div className="flex items-center text-slate-400 text-[10px] font-bold">
                  <Calendar className="h-3 w-3 mr-1" />
                  {item.date}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mb-2">{item.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-2">
                 <button className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center hover:translate-x-1 transition-transform">
                    View Details <ChevronRight className="h-3 w-3 ml-1" />
                 </button>
                 <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-slate-300">
                        <Share2 className="h-3 w-3" />
                    </Button>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-slate-300">
                            <ExternalLink className="h-3 w-3" />
                        </Button>
                    </a>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
