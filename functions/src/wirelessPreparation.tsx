import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Heading,
    Text,
    Link
} from '@react-email/components'

import { WelcomeEmailProps } from './typing'

export const WelcomeEmail = ({ customer, myInfo }: WelcomeEmailProps) => (
    <Html>
        <Head>
            <style>
                {`
          body { background-color: #f9fafb; font-family: Arial, sans-serif; }
        `}
            </style>
        </Head>
        <Preview>
            Get ready for a smooth transition to Verizon Wireless!
        </Preview>
        <Body className="bg-gray-100 py-6 rounded-sm px-3">
            <Container className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <Section className="bg-blue-600 text-white text-center py-4">
                    <Heading className="text-xl font-bold">
                        Welcome to Verizon Wireless
                    </Heading>
                </Section>
                <Section className="p-6">
                    <Text className="text-gray-700 mb-4">
                        Dear{' '}
                        <span className="font-semibold">
                            {customer.name.split(' ')[0]}
                        </span>
                        ,
                    </Text>
                    <Text className="text-gray-700 mb-4">
                        Thank you for choosing Verizon Wireless! We’re excited
                        to welcome you to our network and are here to ensure
                        your transaction is as seamless as possible.
                    </Text>

                    <Heading
                        as="h2"
                        className="text-lg font-semibold text-blue-600 mb-2"
                    >
                        1. Bringing Your Own Device (BYOD)
                    </Heading>
                    <Text className="text-gray-700 mb-4">
                        - Ensure the device is{' '}
                        <span className="font-bold">unlocked</span> by your
                        current carrier. <br />- Provide us with the{' '}
                        <span className="font-bold">IMEI</span> (International
                        Mobile Equipment Identity) of your device. You can find
                        this number in your device settings or by dialing{' '}
                        <code>*#06#</code>.
                    </Text>

                    <Heading
                        as="h2"
                        className="text-lg font-semibold text-blue-600 mb-2"
                    >
                        2. Trading In an Old Device
                    </Heading>
                    <Text className="text-gray-700 mb-4">
                        - Ensure the device is unlocked. <br />
                        - Back up your data and perform a factory reset to
                        remove personal information before sending your device
                        to Verizon. <br />- Provide the IMEI when requested
                        during the trade-in process.
                    </Text>

                    <Heading
                        as="h2"
                        className="text-lg font-semibold text-blue-600 mb-2"
                    >
                        3. Porting Your Number to Verizon
                    </Heading>
                    <Text className="text-gray-700 mb-4">
                        - Obtain the{' '}
                        <span className="font-bold">account number</span> and{' '}
                        <span className="font-bold">Transfer PIN</span> from
                        your current carrier. <br />
                        - The account number is usually available on your bill
                        or in your carrier's app. <br />
                        - The Transfer PIN can be requested from your carrier
                        (contact their customer service if needed). <br />-
                        Ensure your current account is active, as your number
                        cannot be transferred from a closed account.
                    </Text>

                    {customer.carrier === 'AT&T' && (
                        <Section>
                            <Text className="text-md font-bold text-gray-800 mt-4">
                                Getting Transfer PIN from AT&T
                            </Text>

                            <Text className="text-sm text-gray-600 mt-2">
                                - Log in to your{' '}
                                <Link
                                    href="https://www.att.com/myatt/"
                                    className="text-blue-600 underline"
                                >
                                    myAT&T
                                </Link>{' '}
                                profile.
                                <br />- Select{' '}
                                <strong>People & Permissions</strong>.<br />-
                                Select <strong>Wireless</strong>.<br />- Scroll
                                to <strong>Transfer phone number</strong>.<br />
                                - Select <strong>Request a new PIN</strong>.
                                <br />- Your PIN will appear on the screen.
                            </Text>
                        </Section>
                    )}

                    {customer.carrier === 'T-Mobile' && (
                        <Section>
                            <Text className="text-md font-bold text-gray-800 mt-4">
                                Getting Transfer PIN from T-Mobile
                            </Text>

                            <Text className="text-sm text-gray-600 mt-2">
                                - Log in to your T-Mobile account at{' '}
                                <Link
                                    href="https://www.t-mobile.com/"
                                    className="text-blue-600 underline"
                                >
                                    T-Mobile.com
                                </Link>
                                .<br />- Select your name or{' '}
                                <strong>My Account</strong> in the top right
                                corner.
                                <br />- Select <strong>Profile</strong>.<br />-
                                Select <strong>Line Settings</strong>.<br />-
                                Select <strong>Request a transfer PIN</strong>.
                                <br />- Select{' '}
                                <strong>Get a transfer PIN</strong> and follow
                                the on-screen directions.
                                <br />- Your transfer PIN is temporary and will
                                display on the screen. Make a note of it.
                            </Text>
                        </Section>
                    )}

                    <Heading
                        as="h2"
                        className="text-lg font-semibold text-blue-600 mb-2"
                    >
                        4. Preparing for Your Account Setup
                    </Heading>
                    <Text className="text-gray-700 mb-4">
                        - If you are an existing{' '}
                        <span className="font-bold">Verizon Fios customer</span>
                        , ensure you have your{' '}
                        <span className="font-bold">login credentials</span>{' '}
                        ready. We recommend verifying your credentials
                        beforehand to avoid delays during the transaction.{' '}
                        <br />- If you would like to set up{' '}
                        <span className="font-bold">Auto Pay</span> (recommended
                        for a $10 per line discount), please have your{' '}
                        <span className="font-bold">
                            checking account details
                        </span>{' '}
                        ready.
                    </Text>

                    <Text className="text-gray-700 mb-4">
                        If you have any questions or need assistance gathering
                        this information, feel free to contact me at{' '}
                        <Link
                            href={`mailto:${myInfo.email}`}
                            className="text-blue-600 underline"
                        >
                            {myInfo.email}
                        </Link>{' '}
                        or call me at{' '}
                        <Link href={`tel:${myInfo.phone}`}>
                            <span className="font-bold">{myInfo.phone}</span>
                        </Link>
                        . I'm here to help you every step of the way.
                    </Text>

                    <Text className="text-gray-700">
                        Thank you again for choosing Verizon Wireless. We look
                        forward to serving you with the nation’s most reliable
                        network.
                    </Text>

                    <Text className="text-gray-700 mt-6">
                        Best regards, <br />
                        <span className="font-semibold">
                            {myInfo.name}
                        </span>{' '}
                        <br />
                        Verizon Fios & Wireless Specialist
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
)

export default WelcomeEmail
