import {
    Body,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text
} from '@react-email/components'

export interface IntroductionEmailProps {
    myName: string
    myNumber: string
    customerName: string
    propertyName: string
    myEmail: string
}

const IntroductionEmail = ({
    myName,
    customerName,
    propertyName,
    myEmail,
    myNumber
}: IntroductionEmailProps) => {
    const previewText = `Your dedicated Verizon Specialist at ${propertyName}.`

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-100 mx-auto font-sans p-4 shadow-md m-2 rounded-md  items-center justify-center flex flex-col">
                    <Container className="text-lg">
                        <Text className="text-lg">Hello {customerName},</Text>
                        <Text className="text-lg">
                            This is {myName}, your dedicated Verizon
                            representative for {propertyName}. I wanted to
                            personally welcome you to the building and offer my
                            assistance with any Verizon-related services or
                            questions you may have. Whether it's about setting
                            up new connections, troubleshooting, or optimizing
                            your services, I'm here to ensure you have a
                            seamless experience. As your dedicated Verizon
                            contact working in close collaboration with the
                            property, my goal is to make your experience as
                            convenient as possible
                        </Text>
                        <Text className="text-lg">
                            Feel free to reach out to me anytime via SMS or call
                            at{' '}
                            <Link href={`sms:+1${myNumber}`}>{myNumber}</Link>{' '}
                            or via email at{' '}
                            <Link href={`mailto:${myEmail}`}>{myEmail}</Link>.
                            Your satisfaction is my top priority, and I'm
                            committed to providing you with top-notch support.
                        </Text>
                        <Text className="text-lg">
                            Looking forward to helping you make the most of your
                            Verizon services in your new space. Please don't
                            hesitate to get in touch if you need any assistance.
                        </Text>
                        <Section className="space-y-0 m-0">
                            <Text className="text-lg">Best regards,</Text>
                            <Text className="text-lg">{myName}</Text>
                            <Text className="text-lg">
                                Verizon Representative
                            </Text>
                            <Text className="text-lg">
                                <Link href={`tel:+1${myNumber}`}>
                                    {myNumber}
                                </Link>
                            </Text>
                            <Text className="text-lg">
                                <Link href={`mailto:${myEmail}`}>
                                    {myEmail}
                                </Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default IntroductionEmail
