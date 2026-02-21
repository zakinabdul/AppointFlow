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
import * as S from "./styles";

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
            <Body style={S.main}>
                <Container style={S.container}>
                    <Section style={S.headerBrand}>
                        <div style={S.headerLogo}>AF</div>
                    </Section>

                    <Heading style={S.h1}>Reminder: Event starts soon! ⏰</Heading>
                    <Text style={S.text}>Hi {registrantName},</Text>

                    <Text style={S.text}>
                        This is a reminder that <strong>{eventTitle}</strong> is happening in {daysUntilEvent}.
                    </Text>

                    {customMessage && (
                        <Section style={S.highlightBox}>
                            <Text style={S.h2}>Note from Organizer:</Text>
                            <Text style={S.text}>{customMessage}</Text>
                        </Section>
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
                                    Join Meeting
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
                                    Get Directions
                                </Button>
                            </Section>
                        )}
                    </Section>

                    <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
                        <Text style={S.h2}>Are you still coming?</Text>
                        <Row style={{ marginTop: "24px" }}>
                            <Column style={{ paddingRight: '8px' }}>
                                <Button style={S.buttonSuccess} href={`${frontendUrl}/attendance-confirmed?id=${registrationId}&status=attending`}>
                                    Yes, I'm there
                                </Button>
                            </Column>
                            <Column style={{ paddingLeft: '8px' }}>
                                <Button style={S.buttonDanger} href={`${frontendUrl}/attendance-confirmed?id=${registrationId}&status=declined`}>
                                    Can't make it
                                </Button>
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={S.hr} />

                    <Text style={S.footer}>
                        Powered by <strong>AppointFlow</strong>
                        <br /><br />
                        <Link href={`${frontendUrl}/api/email/unsubscribe?id=${registrationId}`} style={S.unsub}>
                            Unsubscribe from reminders
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};
