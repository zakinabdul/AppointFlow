import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface ReminderEmailProps {
    registrantName: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    location: string;
    isOnline: boolean;
    meetingLink?: string;
    daysUntilEvent: string; // e.g. "24 hours", "2 hours"
    customMessage?: string;
    registrationId: string;
    frontendUrl: string;
}

export const ReminderEmail = ({
    registrantName,
    eventTitle,
    eventDate,
    eventTime,
    location,
    isOnline,
    meetingLink,
    daysUntilEvent,
    customMessage,
    registrationId,
    frontendUrl,
}: ReminderEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Reminder: {eventTitle} starts in {daysUntilEvent}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Reminder: Event starts soon! ⏰</Heading>
                    <Text style={text}>Hi {registrantName},</Text>
                    <Text style={text}>
                        This is a reminder that <strong>{eventTitle}</strong> is happening in {daysUntilEvent}.
                    </Text>

                    {customMessage && (
                        <Section style={messageBox}>
                            <Text style={messageTitle}>Note from Organizer:</Text>
                            <Text style={text}>{customMessage}</Text>
                        </Section>
                    )}

                    <Section style={box}>
                        <Text style={paragraph}>
                            <strong>Date:</strong> {eventDate}
                            <br />
                            <strong>Time:</strong> {eventTime}
                            <br />
                            <strong>Location:</strong> {isOnline ? "Online Event" : location}
                        </Text>

                        {isOnline && meetingLink && (
                            <Button style={button} href={meetingLink}>
                                Join Meeting
                            </Button>
                        )}

                        {!isOnline && (
                            <Button
                                style={button}
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    location
                                )}`}
                            >
                                Get Directions
                            </Button>
                        )}
                    </Section>

                    <Section style={section}>
                        <Text style={text}><strong>Are you still coming?</strong></Text>
                        <Row>
                            <Column style={{ paddingRight: '8px' }}>
                                <Button style={confirmButton} href={`${frontendUrl}/attendance-confirmed?id=${registrationId}&status=attending`}>
                                    ✅ Yes, I'm there
                                </Button>
                            </Column>
                            <Column style={{ paddingLeft: '8px' }}>
                                <Button style={declineButton} href={`${frontendUrl}/attendance-confirmed?id=${registrationId}&status=declined`}>
                                    ❌ Can't make it
                                </Button>
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        AppointFlow
                        <br />
                        <Link href={`${frontendUrl}/api/email/unsubscribe?id=${registrationId}`} style={unsub}>
                            Unsubscribe from reminders
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles (reused mostly)
const main = { backgroundColor: "#f6f9fc", fontFamily: 'sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px" };
const box = { padding: "24px", backgroundColor: "#f2f3f3", borderRadius: "4px", marginBottom: "24px" };
const messageBox = { padding: "16px", backgroundColor: "#fff4e5", borderRadius: "4px", border: "1px solid #ffe0b2", marginBottom: "24px" };
const messageTitle = { fontWeight: "bold", fontSize: "14px", color: "#af5b00", marginBottom: "8px" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", textAlign: "center" as const, margin: "30px 0" };
const text = { color: "#333", fontSize: "16px", lineHeight: "24px" };
const paragraph = { color: "#333", fontSize: "16px", lineHeight: "24px", marginBottom: "20px" };
const button = { backgroundColor: "#000", borderRadius: "5px", color: "#fff", fontSize: "16px", fontWeight: "bold", textDecoration: "none", textAlign: "center" as const, display: "block", width: "100%", padding: "10px" };
const confirmButton = { ...button, backgroundColor: "#10b981" };
const declineButton = { ...button, backgroundColor: "#ef4444" };
const section = { textAlign: "center" as const, marginTop: "32px" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
const unsub = { color: "#8898aa", textDecoration: "underline" };
