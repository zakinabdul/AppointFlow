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
            <Body style={S.main}>
                <Container style={S.container}>
                    <Section style={S.headerBrand}>
                        <div style={S.headerLogo}>AF</div>
                    </Section>

                    <Heading style={S.h1}>Are you still coming? 🤔</Heading>
                    <Text style={S.text}>Hi {registrantName},</Text>

                    <Text style={S.text}>
                        <strong>{eventTitle}</strong> is starting in just {hoursBefore} hours!
                        To help the organizer prepare, please let us know if you are still able to make it.
                    </Text>

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
                    </Section>

                    <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
                        <Text style={S.h2}>Please confirm your attendance</Text>
                        <Row style={{ marginTop: "24px" }}>
                            <Column style={{ paddingRight: '8px' }}>
                                <Button style={S.buttonSuccess} href={`${frontendUrl}/attendance-confirmed?id=${registrationId}&status=attending`}>
                                    Yes, I'm coming
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
                            Unsubscribe from event updates
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};
