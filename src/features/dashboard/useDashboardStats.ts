
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../auth/AuthContext'

export type DashboardStats = {
    totalEvents: number
    totalRegistrations: number
    upcomingEvents: number
    capacityUtilization: number
}

export function useDashboardStats() {
    const { user } = useAuth()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const fetchStats = async () => {
            try {
                // Fetch all events for organizer
                // Ensure we select start_time to do accurate minute-by-minute cutoff
                const { data: events, error: eventsError } = await supabase
                    .from('events')
                    .select('id, start_date, start_time, capacity, current_registrations')
                    .eq('organizer_id', user.id)

                if (eventsError) throw eventsError

                const totalEvents = events?.length || 0
                const totalRegistrations = events?.reduce((acc, curr) => acc + (curr.current_registrations || 0), 0) || 0

                const now = new Date();

                const upcomingEvents = events?.filter(e => {
                    if (!e.start_date) return true;
                    // Provide a default 00:00 time if missing so we can parse a valid Date
                    const eventDate = new Date(`${e.start_date}T${e.start_time || "00:00"}:00`);
                    return isNaN(eventDate.getTime()) ? true : eventDate > now;
                }).length || 0

                const totalCapacity = events?.reduce((acc, curr) => acc + (curr.capacity || 0), 0) || 0
                const capacityUtilization = totalCapacity > 0 ? (totalRegistrations / totalCapacity) * 100 : 0

                setStats({
                    totalEvents,
                    totalRegistrations,
                    upcomingEvents,
                    capacityUtilization
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [user])

    return { stats, loading }
}
