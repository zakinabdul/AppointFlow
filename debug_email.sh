#!/bin/bash

# Test the Broadcast Email Endpoint
curl -X POST http://localhost:3001/api/email/broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-token" \
  -d '{
    "eventId": "test-event-1",
    "eventTitle": "Test Event",
    "subject": "Test Broadcast",
    "htmlBody": "<p>This is a test email.</p>",
    "registrants": [
      { "id": "user-1", "email": "zakinabdul@gmail.com", "full_name": "Zakin Abdul" }
    ]
  }'

echo -e "\n\nRequest sent. Check the backend terminal for logs."
