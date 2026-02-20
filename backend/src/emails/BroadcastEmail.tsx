import {
    Body,
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

interface BroadcastEmailProps {
    registrantName: string;
    eventTitle: string;
    subject: string;
    htmlBody: string; // The rich text content from organizer
    registrationId: string;
    frontendUrl: string;
}

export const BroadcastEmail = ({
    registrantName,
    eventTitle,
    subject,
    htmlBody,
    registrationId,
    frontendUrl,
}: BroadcastEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{subject}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Message from {eventTitle}</Heading>
                    <Text style={text}>Hi {registrantName},</Text>

                    <div style={contentBox} dangerouslySetInnerHTML={{ __html: htmlBody }} />

                    <Hr style={hr} />

                    <Text style={footer}>
                        This message was sent by the organizer of {eventTitle}.
                        <br />
                        AppointFlow
                        <br />
                        <Link href={`${frontendUrl}/api/email/unsubscribe?id=${registrationId}`} style={unsub}>
                            Unsubscribe
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

const main = { backgroundColor: "#f6f9fc", fontFamily: 'sans-serif' };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px" };
const contentBox = { padding: "0 12px", lineHeight: "24px", color: "#333" };
const h1 = { color: "#333", fontSize: "24px", fontWeight: "bold", textAlign: "center" as const, margin: "30px 0" };
const text = { color: "#333", fontSize: "16px", lineHeight: "24px", padding: "0 12px" };
const hr = { borderColor: "#e6ebf1", margin: "40px 0 20px" };
const footer = { color: "#8898aa", fontSize: "12px", textAlign: "center" as const };
const unsub = { color: "#8898aa", textDecoration: "underline" };
