
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../auth/AuthContext'

const createEventSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    slug: z.string().min(3, 'Custom link must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed').optional().or(z.literal('')),
    description: z.string().optional(),
    event_type: z.enum(['online', 'in-person']),
    location: z.string().min(1, 'Location/Link is required'),
    start_date: z.string(),
    start_time: z.string(),
    capacity: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1, 'Capacity must be at least 1')),
    customReminderHours: z.string().transform(val => val ? parseInt(val, 10) : undefined).optional(),
    reminderNote: z.string().optional(),
    send24hReminder: z.boolean().default(false),
    requiresAttendanceConfirmation: z.boolean().default(false),
    confirmationEmailHours: z.string().transform(val => val ? parseInt(val, 10) : undefined).optional(),
})

type CreateEventForm = z.infer<typeof createEventSchema>

export function CreateEventPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateEventForm>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            event_type: 'online',
            send24hReminder: false,
            requiresAttendanceConfirmation: false
        }
    })

    const eventType = watch('event_type')
    const requiresConfirmation = watch('requiresAttendanceConfirmation')

    const onSubmit = async (data: CreateEventForm) => {
        if (!user) return
        setLoading(true)
        setError(null)

        try {
            // Generate slug if empty
            let slug = data.slug
            if (!slug) {
                // Simple random slug
                slug = Math.random().toString(36).substring(2, 8)
            }

            // Extract and map fields
            const { customReminderHours, reminderNote, send24hReminder, requiresAttendanceConfirmation, confirmationEmailHours, ...eventData } = data;

            const { error } = await supabase.from('events').insert([
                {
                    ...eventData,
                    custom_reminder_hours: customReminderHours,
                    reminder_note: reminderNote,
                    send_24h_reminder: send24hReminder,
                    confirmation_email_hours: requiresAttendanceConfirmation ? confirmationEmailHours : 0,
                    slug,
                    organizer_id: user.id
                }
            ])

            if (error) throw error
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Failed to create event')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>Enter the details for your new event.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input id="title" placeholder="My Awesome Webinar" {...register('title')} />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Custom Link (Optional)</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">{window.location.host}/e/</span>
                                <Input id="slug" placeholder="my-event-name" {...register('slug')} />
                            </div>
                            <p className="text-xs text-muted-foreground">Leave empty to generate a random short link.</p>
                            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" placeholder="A brief description..." {...register('description')} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="event_type">Event Type</Label>
                                <select
                                    id="event_type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register('event_type')}
                                >
                                    <option value="online">Online</option>
                                    <option value="in-person">In-Person</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">{eventType === 'online' ? 'Meeting Link' : 'Address'}</Label>
                                <Input id="location" placeholder={eventType === 'online' ? 'https://zoom.us/...' : '123 Main St'} {...register('location')} />
                                {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Date</Label>
                                <Input id="start_date" type="date" {...register('start_date')} />
                                {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start_time">Time</Label>
                                <Input id="start_time" type="time" {...register('start_time')} />
                                {errors.start_time && <p className="text-sm text-red-500">{errors.start_time.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input id="capacity" type="number" placeholder="100" {...register('capacity')} />
                            {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customReminderHours">Custom Reminder (Hours before)</Label>
                                <Input id="customReminderHours" type="number" placeholder="e.g. 2" {...register('customReminderHours')} />
                                <p className="text-xs text-muted-foreground">Optional. Sends an extra email.</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="send24hReminder"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                {...register('send24hReminder')}
                            />
                            <Label htmlFor="send24hReminder">Send standard 24-hour reminder email?</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="requiresAttendanceConfirmation"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                {...register('requiresAttendanceConfirmation')}
                            />
                            <Label htmlFor="requiresAttendanceConfirmation">Schedule an Attendance Confirmation Request?</Label>
                        </div>

                        {requiresConfirmation && (
                            <div className="space-y-2 pl-6">
                                <Label htmlFor="confirmationEmailHours">Hours before event to send request</Label>
                                <Input id="confirmationEmailHours" type="number" placeholder="e.g. 48" {...register('confirmationEmailHours')} />
                                <p className="text-xs text-muted-foreground">They'll get an email asking if they are still coming.</p>
                                {errors.confirmationEmailHours && <p className="text-sm text-red-500">{errors.confirmationEmailHours.message}</p>}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="reminderNote">Things attendees should know (included in reminder)</Label>
                            <textarea
                                id="reminderNote"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Bring your laptop, parking is available at..."
                                {...register('reminderNote')}
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Event'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
