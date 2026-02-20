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

interface AttendanceRequestEmailProps {
    registrantName: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    location: string;
    isOnline: boolean;
    meetingLink?: string;
    registrationId: string;
    frontendUrl: string;
    hoursBefore: number;
}

export const AttendanceRequestEmail = ({
    registrantName,
    eventTitle,
    eventDate,
    eventTime,
    location,
    isOnline,
    meetingLink,
    registrationId,
    frontendUrl,
    hoursBefore,
}: AttendanceRequestEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Please confirm your attendance for {eventTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Are you still coming? 🤔</Heading>
                    <Text style={text}>Hi {registrantName},</Text>

                    <Text style={text}>
                        <strong>{eventTitle}</strong> is starting in just {hoursBefore} hours!
                        To help the organizer prepare, please let us know if you are still able to make it.
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
                    </Section>

                    <Section style={section}>
                        <Text style={text}><strong>Please confirm your attendance:</strong></Text>
                        <Row>
                            <Column style={{ paddingRight: '8px' }}>
                                <Button style={confirmButton} href={`${frontendUrl}/attendance-confirmed?id=${registrationId}&status=attending`}>
                                    ✅ Yes, I'm coming
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

const confirmButton = {
    backgroundColor: "#10b981",
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

const declineButton = {
    ...confirmButton,
    backgroundColor: "#ef4444",
};
