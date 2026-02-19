
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

const signupSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    organizationName: z.string().min(2, 'Organization name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignupForm = z.infer<typeof signupSchema>

export function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    })

    // Note: Detailed profile creation (organization, full name) requires writing to a 'profiles' table after auth.
    // For this MVP, we will just sign up the user. In a real app, we would use a database trigger or a second query.
    const onSubmit = async (data: SignupForm) => {
        setLoading(true)
        setError(null)
        try {
            const { error: signUpError, data: authData } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        organization_name: data.organizationName,
                    },
                },
            })

            if (signUpError) throw signUpError

            if (authData.user) {
                // Create profile record
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            full_name: data.fullName,
                            organization_name: data.organizationName,
                            updated_at: new Date()
                        }
                    ])

                if (profileError) {
                    console.error('Error creating profile:', profileError)
                    // Continue anyway as auth was successful
                }
            }

            navigate('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Failed to sign up')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
                        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input id="organizationName" placeholder="Acme Inc." {...register('organizationName')} />
                        {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register('password')} />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
