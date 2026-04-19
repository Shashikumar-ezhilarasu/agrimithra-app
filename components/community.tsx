"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import {
  ArrowLeft,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Camera,
  Send,
  MapPin,
  Clock,
  UserCircle
} from "lucide-react"

interface CommunityPost {
  _id: string
  userName: string
  userImage?: string
  content: string
  imageUrl?: string
  likes: number
  comments: any[]
  createdAt: string
}

export function Community() {
  const router = useRouter()
  const { t } = useLanguage()
  const [circles, setCircles] = useState<any[]>([])
  const [joinedCircles, setJoinedCircles] = useState<string[]>([])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/posts")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (err) {
      console.error("Failed to fetch posts", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCircles = async () => {
    try {
      const res = await fetch("/api/communities")
      if (res.ok) {
        const data = await res.json()
        setCircles(data)
      }
    } catch (err) {
      console.error("Failed to fetch circles", err)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchCircles()
    // Load joined circles from local storage for persistence in this demo
    const saved = localStorage.getItem("joinedCircles")
    if (saved) setJoinedCircles(JSON.parse(saved))
  }, [])

  const handleJoinCircle = async (circleId: string) => {
    const isJoined = joinedCircles.includes(circleId)
    const action = isJoined ? "leave" : "join"
    
    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId, action }),
      })
      
      if (res.ok) {
        if (isJoined) {
          const newJoined = joinedCircles.filter(id => id !== circleId)
          setJoinedCircles(newJoined)
          localStorage.setItem("joinedCircles", JSON.stringify(newJoined))
        } else {
          const newJoined = [...joinedCircles, circleId]
          setJoinedCircles(newJoined)
          localStorage.setItem("joinedCircles", JSON.stringify(newJoined))
        }
        fetchCircles() // Refresh member counts
      }
    } catch (err) {
      console.error("Failed to update circle membership", err)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostContent,
          userName: guestName || "Progressive Farmer",
          userImage: "", // No profile image for guests
        }),
      })

      if (res.ok) {
        setNewPostContent("")
        setGuestName("")
        setIsPostDialogOpen(false)
        fetchPosts() 
      }
    } catch (err) {
      console.error("Failed to create post", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/60 p-4 shadow-sm">
        <div className="flex items-center space-x-3 max-w-2xl mx-auto w-full">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t("community")}</h1>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 -translate-y-1/2" />
        <div className="max-w-2xl mx-auto relative z-10 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-black mb-1">Farmer's Hub</h2>
                <p className="text-emerald-50 opacity-80 text-xs font-bold uppercase tracking-widest">Connect • Grow • Succeed</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
                <p className="text-xl font-bold">{posts.length}</p>
                <p className="text-[10px] font-black opacity-60 uppercase">Active Discussions</p>
            </div>
        </div>
      </div>

      {/* Community Circles Selection */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Join Communities</h2>
            <div className="h-px bg-slate-100 flex-1 ml-4" />
        </div>
        <div className="flex overflow-x-auto pb-4 space-x-4 no-scrollbar -mx-4 px-4">
            {circles.map((circle) => (
                <Card key={circle._id} className="flex-shrink-0 w-64 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5 group hover:border-emerald-200 transition-all">
                    <div className="relative h-24 overflow-hidden">
                        <img src={circle.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute bottom-2 left-2 bg-white/20 backdrop-blur-md text-[8px] border-none text-white font-bold uppercase">
                            {circle.category}
                        </Badge>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">{circle.name}</h3>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mb-3 h-6 font-medium">{circle.description}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-700">{circle.memberCount.toLocaleString()}</span>
                            </div>
                            <Button 
                                size="sm" 
                                onClick={() => handleJoinCircle(circle._id)}
                                variant={joinedCircles.includes(circle._id) ? "outline" : "default"}
                                className={`rounded-xl h-8 px-4 text-[10px] font-black uppercase tracking-tighter ${
                                    joinedCircles.includes(circle._id) 
                                    ? "border-emerald-100 text-emerald-600 hover:bg-emerald-50" 
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                                }`}
                            >
                                {joinedCircles.includes(circle._id) ? "Joined" : "Join"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Updates</h2>
            <div className="h-px bg-slate-100 flex-1 ml-4" />
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-20 opacity-40">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest">Syncing with field data...</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post._id} className="bg-white border-none shadow-2xl shadow-emerald-900/5 rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-emerald-50 shadow-sm">
                      <AvatarImage src={post.userImage} alt={post.userName} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-600 font-bold">
                        <UserCircle className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm leading-none mb-1">{post.userName}</h3>
                      <div className="flex items-center space-x-2 opacity-50">
                        <MapPin className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Independent Farmer</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <Clock className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-300">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <p className="text-[15px] text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap font-medium">
                  {post.content}
                </p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="w-full h-64 object-cover rounded-3xl mb-4 border border-slate-50"
                  />
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl px-4">
                      <Heart className="h-4 w-4 mr-2" />
                      <span className="text-xs font-black">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl px-4">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span className="text-xs font-black">{post.comments?.length || 0}</span>
                    </Button>
                  </div>
                  <div className="flex items-center">
                     <Button variant="ghost" size="icon" className="text-slate-300 hover:text-emerald-600">
                       <Share2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Floating Add Post Button (Now Open to Everyone) */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-24 right-6 h-16 w-16 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-200 transition-all duration-300 transform hover:scale-110 group z-30"
          >
            <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md mx-auto rounded-[2rem] border-none shadow-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">Share Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Your Name</label>
                <Input 
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Ramesh from Kerala"
                    className="bg-slate-50 border-none rounded-2xl h-12 text-sm font-bold"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Field Status</label>
                <Textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's the update from your crops?"
                    rows={4}
                    className="bg-slate-50 border-none rounded-3xl p-6 text-slate-800 font-medium placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
                />
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1 rounded-2xl h-14 bg-white border-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="flex-1 rounded-2xl h-14 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 font-bold uppercase tracking-widest text-[10px]"
              >
                <Send className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
