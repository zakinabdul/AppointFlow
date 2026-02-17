
import { Outlet } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'

export function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            <div className="flex flex-col justify-center gap-2 bg-primary p-10 text-primary-foreground lg:w-1/2">
                <div className="flex items-center gap-2 text-3xl font-bold">
                    <CalendarDays className="h-8 w-8" />
                    <span>EventAI</span>
                </div>
                <p className="text-xl">Manage your events with intelligence and ease.</p>
            </div>
            <div className="flex flex-1 items-center justify-center p-8 bg-background">
                <div className="w-full max-w-sm space-y-6">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
