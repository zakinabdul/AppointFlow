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
import * as S from "./styles";

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
    aiWelcomeMessage?: string;
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
    aiWelcomeMessage,
}: ConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Registration confirmed for {eventTitle}</Preview>
            <Body style={S.main}>
                <Container style={S.container}>
                    <Section style={S.headerBrand}>
                        <div style={S.headerLogo}>AF</div>
                    </Section>

                    <Heading style={S.h1}>Registration Confirmed! 🎉</Heading>
                    <Text style={S.text}>Hi {registrantName},</Text>

                    {aiWelcomeMessage ? (
                        <Text style={S.text}>{aiWelcomeMessage}</Text>
                    ) : (
                        <Text style={S.text}>
                            You are successfully registered for <strong>{eventTitle}</strong>.
                            We are excited to have you join us!
                        </Text>
                    )}

                    <Section style={S.highlightBox}>
                        <div style={S.detailRow}>
                            <span style={S.detailLabel}>Date:</span> {eventDate}
                        </div>
                        <div style={S.detailRow}>
                            <span style={S.detailLabel}>Time:</span> {eventTime}
                        </div>
                        <div style={S.detailRow}>
                            <span style={S.detailLabel}>Location:</span> {isOnline ? "Online Event" : location}
                        </div>

                        {isOnline && meetingLink && (
                            <Section style={{ marginTop: '24px' }}>
                                <Button style={S.buttonPrimary} href={meetingLink}>
                                    Join Online Meeting
                                </Button>
                            </Section>
                        )}

                        {!isOnline && (
                            <Section style={{ marginTop: '24px' }}>
                                <Button
                                    style={S.buttonPrimary}
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        location
                                    )}`}
                                >
                                    View on Google Maps
                                </Button>
                            </Section>
                        )}
                    </Section>

                    <Section style={S.highlightBox}>
                        <Text style={{ ...S.text, marginBottom: 0, textAlign: 'center' }}>
                            <span style={S.detailLabel}>Registration ID:</span><br />
                            <strong style={{ fontSize: '18px', letterSpacing: '1px' }}>{registrationId.split('-')[0].toUpperCase()}</strong>
                        </Text>
                    </Section>

                    <Hr style={S.hr} />

                    <Text style={S.footer}>
                        Powered by <strong>AppointFlow</strong>
                        <br /><br />
                        <Link href={`${frontendUrl}/api/email/unsubscribe?id=${registrationId}`} style={S.unsub}>
                            Unsubscribe from event updates
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};
