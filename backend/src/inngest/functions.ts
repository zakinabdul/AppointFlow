import { inngest } from "./client";
import { sendEmail } from "../lib/brevo";
import { ReminderEmail } from "../emails/ReminderEmail";
import { BroadcastEmail } from "../emails/BroadcastEmail";
import { render } from "@react-email/components";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const send24hrReminder = inngest.createFunction(
    { id: "send-24hr-reminder" },
    { event: "event/reminder.24hr" },
    async ({ event, step }: any) => {
        const { eventData, registrants } = event.data;

        await step.run("send-emails-batch", async () => {
            const emailPromises = registrants.map(async (registrant: any) => {
                const emailHtml = render(ReminderEmail({
                    registrantName: registrant.full_name,
                    eventTitle: eventData.title,
                    eventDate: eventData.date, // Formatted already
                    eventTime: eventData.time,
                    location: eventData.location,
                    isOnline: eventData.event_type === 'online',
                    meetingLink: eventData.meeting_link,
                    daysUntilEvent: "24 hours",
                    registrationId: registrant.id,
                    frontendUrl: FRONTEND_URL
                }));

                return sendEmail({
                    to: registrant.email,
                    subject: `Reminder: ${eventData.title} is tomorrow!`,
                    html: emailHtml
                });
            });

            await Promise.all(emailPromises);
            return { count: registrants.length };
        });
    }
);

export const sendCustomReminder = inngest.createFunction(
    { id: "send-custom-reminder" },
    { event: "event/reminder.custom" },
    async ({ event, step }: any) => {
        const { eventData, registrants, customMessage, timeBefore } = event.data;

        await step.run("send-custom-emails", async () => {
            const emailPromises = registrants.map(async (registrant: any) => {
                const emailHtml = render(ReminderEmail({
                    registrantName: registrant.full_name,
                    eventTitle: eventData.title,
                    eventDate: eventData.date,
                    eventTime: eventData.time,
                    location: eventData.location,
                    isOnline: eventData.event_type === 'online',
                    meetingLink: eventData.meeting_link,
                    daysUntilEvent: timeBefore, // e.g., "2 hours"
                    customMessage: customMessage,
                    registrationId: registrant.id,
                    frontendUrl: FRONTEND_URL
                }));

                return sendEmail({
                    to: registrant.email,
                    subject: `Reminder: ${eventData.title} starts in ${timeBefore}`,
                    html: emailHtml
                });
            });

            await Promise.all(emailPromises);
            return { count: registrants.length };
        });
    }
);

export const sendBroadcastEmail = inngest.createFunction(
    { id: "send-broadcast-email" },
    { event: "event/broadcast" },
    async ({ event, step }: any) => {
        const { eventTitle, subject, htmlBody, registrants } = event.data;
        console.log(`[Inngest] Starting broadcast email job for "${eventTitle}". Recipients: ${registrants?.length}`);

        const BATCH_SIZE = 50;

        for (let i = 0; i < registrants.length; i += BATCH_SIZE) {
            const batch = registrants.slice(i, i + BATCH_SIZE);

            await step.run(`send-batch-${i}`, async () => {
                console.log(`[Inngest] Processing batch ${i}...`);
                const promises = batch.map(async (registrant: any) => {
                    try {
                        const emailHtml = render(BroadcastEmail({
                            registrantName: registrant.full_name,
                            eventTitle: eventTitle,
                            subject: subject,
                            htmlBody: htmlBody,
                            registrationId: registrant.id,
                            frontendUrl: FRONTEND_URL
                        }));

                        const result = await sendEmail({
                            to: registrant.email,
                            subject: subject,
                            html: emailHtml
                        });
                        console.log(`[Inngest] Email sent to ${registrant.email}. MessageId: ${result.messageId}`);
                        return result;
                    } catch (error) {
                        console.error(`[Inngest] Failed to send email to ${registrant.email}:`, error);
                        throw error;
                    }
                });

                await Promise.all(promises);
            });

            await step.sleep("wait-1s", "1s");
        }
    }
);
