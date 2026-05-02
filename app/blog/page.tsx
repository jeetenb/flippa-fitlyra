import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogClient } from "@/components/blog-client"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch all published blog posts
  const { data: posts, error: postsError } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name", { ascending: true })

  if (postsError) {
    console.log("[v0] Error fetching posts:", postsError)
  }

  if (categoriesError) {
    console.log("[v0] Error fetching categories:", categoriesError)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BlogClient initialPosts={posts || []} categories={categories || []} />
      <Footer />
    </main>
  )
}
