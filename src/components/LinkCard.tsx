"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

interface LinkData {
    id: string
    original_url: string
    slug: string
    clicks: number
    created_at: string
}

export function LinkCard({ link, onDelete }: { link: LinkData; onDelete: () => void }) {
    const [origin, setOrigin] = useState("")

    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    const shortUrl = origin ? `${origin}/${link.slug}` : `/${link.slug}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl)
        // Could add toast here
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return
        const supabase = createClient()
        await supabase.from("links").delete().eq("id", link.id)
        onDelete()
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate max-w-[200px]">
                    /{link.slug}
                </CardTitle>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{link.clicks} clicks</div>
                <p className="text-xs text-muted-foreground truncate mb-4">
                    {link.original_url}
                </p>
                <div className="flex gap-2">
                    <Link href={shortUrl} target="_blank">
                        <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
