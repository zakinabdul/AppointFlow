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
} from "@react-email/components";
import * as React from "react";

interface ConfirmationEmailProps {
    registrantName: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    location: string;
    isOnline: boolean;
    meetingLink?: string;
    registrationId: string;
    frontendUrl: string;
}

export const ConfirmationEmail = ({
    registrantName,
    eventTitle,
    eventDate,
    eventTime,
    location,
    isOnline,
    meetingLink,
    registrationId,
    frontendUrl,
}: ConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Registration confirmed for {eventTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Registration Confirmed! 🎉</Heading>
                    <Text style={text}>Hi {registrantName},</Text>
                    <Text style={text}>
                        You are successfully registered for <strong>{eventTitle}</strong>.
                        We are excited to have you join us!
                    </Text>

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
                                Join Online Meeting
                            </Button>
                        )}

                        {!isOnline && (
                            <Button
                                style={button}
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    location
                                )}`}
                            >
                                View on Google Maps
                            </Button>
                        )}
                    </Section>

                    <Section style={section}>
                        <Text style={text}>
                            <strong>Your Registration ID:</strong> {registrationId}
                        </Text>
                        <Link href={`${frontendUrl}/api/attendance/confirm?id=${registrationId}&status=attending`} style={link}>
                            Confirm Attendance
                        </Link>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Evenza App
                        <br />
                        <Link href={`${frontendUrl}/api/email/unsubscribe?id=${registrationId}`} style={unsub}>
                            Unsubscribe from event updates
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
};

const box = {
    padding: "24px",
    backgroundColor: "#f2f3f3",
    borderRadius: "4px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
};

const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const,
};

const paragraph = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const,
    marginBottom: "20px",
};

const button = {
    backgroundColor: "#000",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "10px",
};

const section = {
    textAlign: "center" as const,
    marginTop: "32px",
};

const link = {
    color: "#2754C5",
    textDecoration: "underline",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center" as const,
};

const unsub = {
    color: "#8898aa",
    textDecoration: "underline",
};
