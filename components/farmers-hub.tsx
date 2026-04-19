"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import {
  TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle,
  ArrowLeft, BookOpen, FlaskConical, Leaf, ChevronDown, ChevronUp,
  Sprout, Clock, IndianRupee, ShieldAlert, CheckCircle2
} from "lucide-react"

type Tab = "prices" | "fertilizers" | "pesticides" | "guides"

const categoryLabels: Record<string, { label: string; color: string }> = {
  cereals: { label: "Cereals", color: "bg-amber-100 text-amber-700" },
  pulses: { label: "Pulses", color: "bg-orange-100 text-orange-700" },
  vegetables: { label: "Vegetables", color: "bg-green-100 text-green-700" },
  cash_crops: { label: "Cash Crops", color: "bg-blue-100 text-blue-700" },
}

export function FarmersHub() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<Tab>("prices")
  const [prices, setPrices] = useState<any[]>([])
  const [knowledge, setKnowledge] = useState<any>({})
  const [priceCategory, setPriceCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState("")

  useEffect(() => {
    if (activeTab === "prices") fetchPrices()
    else fetchKnowledge()
  }, [activeTab, priceCategory, language])

  const fetchPrices = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/market-prices?category=${priceCategory}`)
      if (res.ok) {
        const data = await res.json()
        setPrices(data.prices || [])
        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString())
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchKnowledge = async () => {
    setLoading(true)
    try {
      const type = activeTab === "guides" ? "guides" : activeTab
      const res = await fetch(`/api/knowledge?type=${type}&lang=${language}`)
      if (res.ok) {
        const data = await res.json()
        setKnowledge(data)
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "prices", label: "Market", icon: TrendingUp },
    { id: "fertilizers", label: "Fertilizers", icon: Leaf },
    { id: "pesticides", label: "Pesticides", icon: FlaskConical },
    { id: "guides", label: "Guides", icon: BookOpen },
  ]

  const priceCategories = [
    { id: "all", label: "All" },
    { id: "cereals", label: "Cereals" },
    { id: "pulses", label: "Pulses" },
    { id: "vegetables", label: "Veggies" },
    { id: "cash_crops", label: "Cash" },
  ]

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="rounded-full">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Farmers Hub</h1>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Knowledge · Market · Guides</p>
              </div>
            </div>
            {activeTab === "prices" && (
              <Button variant="ghost" size="icon" onClick={fetchPrices} className="rounded-full">
                <RefreshCw className="h-4 w-4 text-slate-400" />
              </Button>
            )}
          </div>
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-2xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                  activeTab === tab.id ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
                }`}
              >
                <tab.icon className="h-3 w-3" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-40">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-black uppercase tracking-widest">Loading Data...</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-4 pb-28">

          {/* === MARKET PRICES === */}
          {activeTab === "prices" && (
            <>
              {/* Category Filter */}
              <div className="flex space-x-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
                {priceCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setPriceCategory(cat.id); }}
                    className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap border transition-all ${
                      priceCategory === cat.id
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white border-slate-100 text-slate-500"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Price Notice */}
              <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 rounded-2xl p-3 mb-4">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <p className="text-[10px] font-bold text-amber-700">APMC market prices as of {lastUpdated}. Prices vary by region.</p>
              </div>

              <div className="space-y-3">
                {prices.map((item: any) => (
                  <Card key={item.id} className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-slate-800 text-sm">{item.crop}</h3>
                            <Badge className={`text-[8px] font-black px-2 py-0 border-none ${categoryLabels[item.category]?.color}`}>
                              {item.variety}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.market}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-[10px] text-slate-400 font-medium">Min: ₹{item.minPrice}</span>
                            <span className="text-[10px] text-slate-400 font-medium">Max: ₹{item.maxPrice}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-1 mb-1">
                            {item.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                            ) : item.trend === "down" ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : (
                              <Minus className="h-4 w-4 text-slate-400" />
                            )}
                            <span className={`text-[10px] font-black ${
                              item.trend === "up" ? "text-emerald-600" :
                              item.trend === "down" ? "text-red-500" : "text-slate-400"
                            }`}>
                              {item.change > 0 ? "+" : ""}{item.change}%
                            </span>
                          </div>
                          <p className="text-lg font-black text-slate-900">
                            ₹{item.price.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">/{item.unit}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* === FERTILIZERS === */}
          {activeTab === "fertilizers" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p className="text-[10px] font-bold text-blue-700">All information is localized to your selected language ({language.toUpperCase()})</p>
              </div>
              {(knowledge.fertilizers || []).map((item: any) => (
                <Card key={item.id} className={`bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden`}>
                  <button
                    className="w-full text-left p-5"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-[8px] px-2 py-0 border-none ${item.type === "organic" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                              {item.type === "organic" ? "🌿 Organic" : "⚗️ Chemical"}
                            </Badge>
                            <span className="text-[10px] text-slate-400 font-bold">{item.nutrient}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-emerald-600">{item.price}</span>
                        {expandedItem === item.id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </div>
                    </div>
                  </button>
                  {expandedItem === item.id && (
                    <div className="px-5 pb-5 space-y-3">
                      <div className="border-t border-slate-50 pt-4">
                        <div className="bg-emerald-50 rounded-2xl p-4 mb-3">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">📋 Dosage: {item.dosage}</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.uses}</p>
                        </div>
                        <div className="bg-rose-50 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">⚠️ Warning</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.warning}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* === PESTICIDES === */}
          {activeTab === "pesticides" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-orange-50 border border-orange-100 rounded-2xl p-3 mb-2">
                <ShieldAlert className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <p className="text-[10px] font-bold text-orange-700">Always read safety instructions and wear PPE. Keep chemicals out of children's reach.</p>
              </div>
              {(knowledge.pesticides || []).map((item: any) => (
                <Card key={item.id} className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                  <button
                    className="w-full text-left p-5"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.targets.map((t: string) => (
                              <Badge key={t} className="text-[8px] px-2 py-0 border-none bg-orange-100 text-orange-700">{t}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-orange-600">{item.price}</span>
                        {expandedItem === item.id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </div>
                    </div>
                  </button>
                  {expandedItem === item.id && (
                    <div className="px-5 pb-5 space-y-3">
                      <div className="border-t border-slate-50 pt-4">
                        <div className="bg-orange-50 rounded-2xl p-4 mb-3">
                          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">📋 Dosage: {item.dosage}</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.uses}</p>
                        </div>
                        <div className="bg-red-50 rounded-2xl p-4">
                          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">🛡️ Safety Info</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.safety}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* === GUIDES === */}
          {activeTab === "guides" && (
            <div className="space-y-6">
              {(knowledge.guides || []).map((guide: any) => (
                <Card key={guide.id} className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">{guide.icon}</span>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{guide.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-bold">{guide.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <IndianRupee className="h-3 w-3 text-emerald-500" />
                            <span className="text-[10px] text-emerald-600 font-black">{guide.profitPotential}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(guide.steps || []).map((step: any) => (
                        <div key={step.step}>
                          <button
                            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl transition-all"
                            onClick={() => setExpandedStep(expandedStep === `${guide.id}-${step.step}` ? null : `${guide.id}-${step.step}`)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-7 h-7 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-black text-white">{step.step}</span>
                              </div>
                              <span className="text-xs font-bold text-slate-700 text-left">{step.title}</span>
                            </div>
                            {expandedStep === `${guide.id}-${step.step}` ? (
                              <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            )}
                          </button>
                          {expandedStep === `${guide.id}-${step.step}` && (
                            <div className="bg-emerald-50 rounded-2xl p-4 mt-1">
                              <p className="text-sm text-slate-700 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
