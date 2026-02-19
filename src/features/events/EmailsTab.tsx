import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2, Mail, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EmailsTabProps {
    eventId: string;
    eventTitle: string;
}

export function EmailsTab({ eventId, eventTitle }: EmailsTabProps) {
    const [stats, setStats] = useState({
        sent: 0,
        openRate: 0,
        scheduled: 0
    });
    const [loading, setLoading] = useState(false);

    // Broadcast State
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [registrantCount, setRegistrantCount] = useState(0);

    useEffect(() => {
        // Mock stats for now or fetch from backend if implemented
        // In a real app, we'd fetch this from our backend which queries Inngest/Resend
        setStats({
            sent: 124,
            openRate: 45,
            scheduled: 2
        });

        // Fetch registrant count for broadcast estimate
        const fetchCount = async () => {
            const { count } = await supabase
                .from('registrations')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', eventId);
            setRegistrantCount(count || 0);
        };
        fetchCount();
    }, [eventId]);

    const handleSendBroadcast = async () => {
        if (!subject || !body) return;
        setSending(true);

        try {
            // Need to fetch registrants to send them to backend (or backend can fetch)
            // Better for backend to fetch to ensure consistency and security
            // We'll just pass eventId to backend.

            // Get registrants first to confirm (optional, could just send eventId)
            const { data: registrants } = await supabase
                .from('registrations')
                .select('id, email, full_name')
                .eq('event_id', eventId);

            if (!registrants || registrants.length === 0) {
                alert("No registrants to email.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/email/broadcast`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId,
                    eventTitle,
                    subject,
                    htmlBody: body,
                    registrants // Passing list to backend as per plan, though backend fetching is safer for large lists
                })
            });

            if (!response.ok) throw new Error("Failed to send broadcast");

            alert("Broadcast queued successfully!");
            setShowBroadcast(false);
            setSubject("");
            setBody("");
        } catch (error) {
            console.error(error);
            alert("Failed to send broadcast");
        } finally {
            setSending(false);
        }
    };

    if (showBroadcast) {
        return (
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Send Broadcast Email</CardTitle>
                    <CardDescription>Send a message to all {registrantCount} registered attendees.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Subject Line</Label>
                        <Input
                            placeholder="Important update about..."
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Message Body</Label>
                        <div className="bg-white rounded-md text-black">
                            <ReactQuill theme="snow" value={body} onChange={setBody} className="h-64 mb-12" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setShowBroadcast(false)}>Cancel</Button>
                    <Button onClick={handleSendBroadcast} disabled={sending || !subject || !body}>
                        {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {sending ? "Sending..." : `Send to ${registrantCount} People`}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.sent}</div>
                        <p className="text-xs text-muted-foreground">Total sent via Resend</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.openRate}%</div>
                        <p className="text-xs text-muted-foreground">Average engagement</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.scheduled}</div>
                        <p className="text-xs text-muted-foreground">Upcoming reminders</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => setShowBroadcast(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Broadcast Email
                </Button>
            </div>

            {/* Scheduled Emails List (Mock) */}
            <Card>
                <CardHeader>
                    <CardTitle>Scheduled Emails</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">24-Hour Reminder</p>
                                    <p className="text-sm text-muted-foreground">Scheduled for 1 day before event</p>
                                </div>
                            </div>
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
