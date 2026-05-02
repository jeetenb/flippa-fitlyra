"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Calendar, ArrowLeft, Share2, Twitter, Facebook, Linkedin, Copy, Eye, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  image_url: string
  author_name: string
  author_avatar: string
  author_bio: string
  read_time: string
  views: number
  created_at: string
}

interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt: string
  image_url: string
  category: string
  read_time: string
  created_at: string
}

interface BlogPostClientProps {
  post: BlogPost
  relatedPosts: RelatedPost[]
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [copied, setCopied] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    )
  }

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`,
      "_blank",
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-blue-600/5" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </motion.div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{post.excerpt}</p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.author_avatar || "/placeholder.svg"} alt={post.author_name} />
                  <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{post.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views?.toLocaleString() || 0} views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={post.image_url || "/placeholder.svg?height=600&width=1200&query=fitness blog"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-pink-500 hover:prose-a:text-pink-600"
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Share this article</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareOnTwitter}
                    className="hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500 bg-transparent"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareOnFacebook}
                    className="hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600 bg-transparent"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={shareOnLinkedIn}
                    className="hover:bg-blue-700/10 hover:text-blue-700 hover:border-blue-700 bg-transparent"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {copied && <span className="text-sm text-green-500">Copied!</span>}
                </div>
              </div>
            </motion.div>

            {/* Author Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={post.author_avatar || "/placeholder.svg"} alt={post.author_name} />
                      <AvatarFallback className="text-xl">{post.author_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg mb-1">Written by {post.author_name}</p>
                      <p className="text-muted-foreground text-sm">{post.author_bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Related Articles</h2>
                <Link href="/blog">
                  <Button variant="ghost" className="gap-2">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${related.slug}`}>
                      <Card className="h-full overflow-hidden group hover:shadow-lg transition-all">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={related.image_url || "/placeholder.svg?height=400&width=800&query=fitness"}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-5">
                          <Badge variant="outline" className="mb-3">
                            {related.category}
                          </Badge>
                          <h3 className="font-semibold mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-pink-500/10 via-transparent to-blue-600/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who are achieving their fitness goals with AI-powered workout and meal plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-blue-600 w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Read More Articles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
