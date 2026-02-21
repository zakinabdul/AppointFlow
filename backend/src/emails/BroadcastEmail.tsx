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
import * as S from "./styles";

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
            <Body style={S.main}>
                <Container style={S.container}>
                    <Section style={S.headerBrand}>
                        <div style={S.headerLogo}>AF</div>
                    </Section>

                    <Heading style={S.h1}>Message from {eventTitle}</Heading>
                    <Text style={S.text}>Hi {registrantName},</Text>

                    <Section style={{ ...S.highlightBox, backgroundColor: "#ffffff", padding: "0" }}>
                        <div style={{ ...S.text, color: "#18181B" }} dangerouslySetInnerHTML={{ __html: htmlBody }} />
                    </Section>

                    <Hr style={S.hr} />

                    <Text style={S.footer}>
                        This message was sent by the organizer of <strong>{eventTitle}</strong>.
                        <br /><br />
                        Powered by <strong>AppointFlow</strong>
                        <br /><br />
                        <Link href={`${frontendUrl}/api/email/unsubscribe?id=${registrationId}`} style={S.unsub}>
                            Unsubscribe from updates
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};
