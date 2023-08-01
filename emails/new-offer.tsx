import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export interface NewOfferEmailTemplateProps {
  offer: number
  from: string
  message?: string
}

const NewOfferEmailTemplate = ({
  offer,
  from,
  message,
}: NewOfferEmailTemplateProps) => {
  return (
    <Tailwind>
      <Html lang="en">
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily={['Helvetica', 'Arial']}
            webFont={{
              url: 'https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>

        <Body className="bg-gray-100">
          <Section className="my-4">
            <Column>
              <Text className="font-medium text-center text-lg">
                side.domains
              </Text>
            </Column>
          </Section>

          <Container className="mx-auto mb-8 bg-white rounded overflow-hidden shadow-sm">
            <Section>
              <Column className="px-4">
                <Text>
                  {from} has made an offer of ${offer} USD on your domain.
                </Text>

                {message && (
                  <Text>
                    They also included the following message:
                    <br />
                    {message}
                  </Text>
                )}
              </Column>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

export default NewOfferEmailTemplate
