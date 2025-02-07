import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { format } from 'date-fns'
import * as React from 'react'

interface StatusChangeNotificationEmailProps {
  domain_name: string
  previous_status: string
  new_status: string
  updated_at: Date
}

const StatusChangeNotificationEmail = ({
  domain_name,
  previous_status,
  new_status,
  updated_at,
}: StatusChangeNotificationEmailProps) => {
  const previewText = `Status update for ${domain_name}: ${previous_status} → ${new_status}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Domain Status Update for {domain_name}
          </Heading>

          <Section style={section}>
            <Text style={statusText}>Status changed from</Text>

            <Row style={statusRow}>
              <Column align="left">
                <Text style={statusPill}>{previous_status}</Text>
              </Column>
              <Column align="center">
                <Text style={statusTextTo}>to</Text>
              </Column>
              <Column align="right">
                <Text style={statusPill}>{new_status}</Text>
              </Column>
            </Row>

            <Text style={timestamp}>
              Updated on {format(updated_at, "MMMM do, yyyy 'at' h:mm:ss a")}
            </Text>
          </Section>

          <Text style={footer}>
            This email was sent by{' '}
            <Link href="https://side.domains" style={link}>
              side.domains
            </Link>
            . If you don&apos;t want to receive status notifications for this
            domain,{' '}
            <Link href="https://app.side.domains" style={link}>
              visit the dashboard
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, "Segoe UI", sans-serif',
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
}

const heading = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: '400',
  textAlign: 'left',
  margin: '16px 0',
}

const section = {
  backgroundColor: '#f3f4f6',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const statusRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const statusText = {
  color: '#4b5563',
  fontSize: '16px',
  margin: '12px 0',
}

const statusTextTo = {
  ...statusText,
  margin: '12px',
}

const statusPill = {
  backgroundColor: '#6b7280',
  color: '#ffffff',
  padding: '8px 16px',
  borderRadius: '16px',
  fontSize: '14px',
  fontWeight: '500',
  display: 'inline-block',
}

const timestamp = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '20px 0 0 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 0',
  textAlign: 'center',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

export default StatusChangeNotificationEmail
