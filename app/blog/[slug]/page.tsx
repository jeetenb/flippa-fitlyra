import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogPostClient } from "@/components/blog-post-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch the blog post
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (error || !post) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("blog_posts")
    .update({ views: (post.views || 0) + 1 })
    .eq("id", post.id)

  // Fetch related posts
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, image_url, category, read_time, created_at")
    .eq("published", true)
    .eq("category", post.category)
    .neq("id", post.id)
    .limit(3)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BlogPostClient post={post} relatedPosts={relatedPosts || []} />
      <Footer />
    </main>
  )
}
