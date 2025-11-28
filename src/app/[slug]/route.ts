import { createServerClient } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const supabase = createServerClient()

    // Fetch the link
    const { data: link, error } = await supabase
        .from("urls")
        .select("original_url, id, clicks")
        .eq("slug", slug)
        .single()

    if (error || !link) {
        // Redirect to home if not found
        return NextResponse.redirect(new URL("/", request.url))
    }

    // Increment clicks (asynchronously)
    await supabase
        .from("urls")
        .update({ clicks: link.clicks + 1 })
        .eq("id", link.id)

    // Redirect
    return NextResponse.redirect(link.original_url)
}
