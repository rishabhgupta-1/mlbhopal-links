"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { CreateLinkModal } from "@/components/CreateLinkModal"
import { LinkCard } from "@/components/LinkCard"
import { Loader2 } from "lucide-react"

interface LinkData {
    id: string
    original_url: string
    slug: string
    clicks: number
    created_at: string
}

export default function Dashboard() {
    const [links, setLinks] = useState<LinkData[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLinks = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from("urls")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching links:", error)
            alert("Error fetching links: " + error.message)
        }

        if (data) {
            setLinks(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchLinks()
    }, [])

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <CreateLinkModal onLinkCreated={fetchLinks} />
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {links.map((link) => (
                        <LinkCard key={link.id} link={link} onDelete={fetchLinks} />
                    ))}
                    {links.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No links created yet. Click the button above to create one.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
