
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Registrant = {
    id: string
    full_name: string
    email: string
    phone: string
    professional_status: string
    created_at: string
}

export type EventAnalytics = {
    registrants: Registrant[]
    totalRegistrations: number
    professionalStatusBreakdown: { name: string; value: number }[]
    registrationTrend: { date: string; count: number }[]
}

export function useEventAnalytics(eventId: string | undefined) {
    const [data, setData] = useState<EventAnalytics | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!eventId) return

        const fetchAnalytics = async () => {
            try {
                const { data: registrantsData, error: regError } = await supabase
                    .from('registrations')
                    .select('*')
                    .eq('event_id', eventId)
                    .order('created_at', { ascending: false })

                if (regError) throw regError

                const registrants = registrantsData as Registrant[]
                const totalRegistrations = registrants.length

                // Calculate breakdown
                const statusCounts: Record<string, number> = {}
                registrants.forEach(r => {
                    const status = r.professional_status || 'Unknown'
                    statusCounts[status] = (statusCounts[status] || 0) + 1
                })
                const professionalStatusBreakdown = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

                // Calculate trend (by day)
                const trendDates: Record<string, number> = {}
                registrants.forEach(r => {
                    const date = new Date(r.created_at).toISOString().split('T')[0]
                    trendDates[date] = (trendDates[date] || 0) + 1
                })

                // Sort dates
                const registrationTrend = Object.entries(trendDates)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([date, count]) => ({ date, count }))

                setData({
                    registrants,
                    totalRegistrations,
                    professionalStatusBreakdown,
                    registrationTrend
                })
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [eventId])

    return { data, loading, error }
}
