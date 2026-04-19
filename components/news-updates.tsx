"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Share2, ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function NewsUpdates() {
  const { language } = useLanguage()
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/news?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        setUpdates(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching news", err)
        setLoading(false)
      })
  }, [language]) // re-fetch whenever language changes

  const typeLabels: Record<string, string> = {
    en: { scheme: "scheme", news: "news" } as any,
    hi: { योजना: "योजना", समाचार: "समाचार", scheme: "योजना", news: "समाचार" } as any,
    ta: { திட்டம்: "திட்டம்", செய்தி: "செய்தி", scheme: "திட்டம்", news: "செய்தி" } as any,
    ml: { "പദ്ധതി": "പദ്ധതി", "വാർത്ത": "വാർത്ത", scheme: "പദ്ധതി", news: "വാർത്ത" } as any,
    kn: { "ಯೋಜನೆ": "ಯೋಜನೆ", "ಸುದ್ದಿ": "ಸುದ್ದಿ", scheme: "ಯೋಜನೆ", news: "ಸುದ್ದಿ" } as any,
    te: { "పథకం": "పథకం", "వార్త": "వార్త", scheme: "పథకం", news: "వార్త" } as any,
  };

  const viewDetailsLabel: Record<string, string> = {
    en: "View Details", hi: "विवरण देखें", ta: "விவரங்கள் காண்க",
    ml: "വിശദാംശങ്ങൾ കാണുക", kn: "ವಿವರ ನೋಡಿ", te: "వివరాలు చూడండి",
  };

  const getLang = (l: string) => typeLabels[l] || typeLabels.en;
  const getTypeLabel = (rawType: string) => {
    const map = getLang(language) as any;
    return map[rawType] || rawType;
  };
  const isSchemeType = (rawType: string) => {
    return rawType === 'scheme' || rawType === 'योजना' || rawType === 'திட்டம்' ||
      rawType === 'പദ്ധതി' || rawType === 'ಯೋಜನೆ' || rawType === 'పథకం';
  };

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
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=400&auto=format&fit=crop' }}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-4 flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={`text-[8px] font-black uppercase px-2 py-0 border-none flex-shrink-0 ${
                  isSchemeType(item.type) ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {getTypeLabel(item.type)}
                </Badge>
                <div className="flex items-center text-slate-400 text-[10px] font-bold">
                  <Calendar className="h-3 w-3 mr-1" />
                  {item.date}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mb-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-1">
                <a
                  href={item.link !== '#' ? item.link : undefined}
                  target={item.link !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center hover:translate-x-1 transition-transform"
                >
                  {viewDetailsLabel[language] || viewDetailsLabel.en}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </a>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-slate-300"
                    onClick={() => navigator.clipboard.writeText(item.link !== '#' ? item.link : window.location.href)}>
                    <Share2 className="h-3 w-3" />
                  </Button>
                  {item.link !== '#' && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-slate-300">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
