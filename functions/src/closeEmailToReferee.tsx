import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

import { Referral } from './typing'
import { sendMe } from './utils'
type Quote = {
    quote?: string
    author?: string
}
export type EmailRef = Referral & Quote
export const CloseReferralEmailToReferee = (data: EmailRef) => {
    const {
        name,
        due_date,
        order_date,
        address,
        apt,
        phone,
        moveIn,
        email,
        referee,
        quote,
        author
    } = data
    const previewText = `Congratualtions ${
        referee?.name.split(' ')[0]
    }! This Referral Has Been Closed`

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-200  my-auto mx-auto font-sans px-2">
                    <Container className="border shadow-md border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[720px]">
                        <Container className="mx-auto flex justify-center align-center">
                            <Text className="text-center text-xl font-bold">
                                Congratulations {referee?.name.split(' ')[0]}!
                            </Text>
                            <Text className="text-center text-xl font-bold">
                                {' '}
                                This Referral Has Been Closed
                            </Text>
                        </Container>
                        <Text className="text-center text-md italic">
                            You should be getting your points shortly, keep
                            those referrals coming!
                        </Text>
                        <Section className="text-center my-3">
                            <Text className="text-md">
                                Please if you have a moment and have some{' '}
                                <strong>Fios and / or Wireless</strong>{' '}
                                referrals, submit those now, why wait!
                            </Text>
                            <Link
                                href="https://www.verizonreferralrewards.com/"
                                onClick={async () => {
                                    sendMe(data)
                                }}
                                target={'_blank'}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 my-12  rounded-md"
                            >
                                Submit Referral
                            </Link>
                            <Text className="text-gray-600 font-semibold text-md italic">
                                -- Do not forget that you can submit move outs,
                                lease renewal or moving within the property --
                            </Text>
                        </Section>
                        <Hr className="h-[1px] bg-slate-400" />
                        <Container>
                            <Text className="text-center text-xl font-bold">
                                Here are the details
                            </Text>
                            <Section>
                                <Text className="capitalize">Name: {name}</Text>
                                <Text className="capitalize">
                                    Address: {address}
                                </Text>
                                {apt && (
                                    <Text className="uppercase">
                                        Apt: {apt}
                                    </Text>
                                )}

                                <Text className="capitalize">
                                    Move In: {new Date(moveIn!).toDateString()}
                                </Text>
                                <Text>Phone: {phone}</Text>
                                <Text>Email: {email}</Text>
                                <Text>
                                    Order Date:{' '}
                                    {new Date(order_date!).toDateString()}
                                </Text>
                                <Text>
                                    Installation Date:{' '}
                                    {new Date(due_date!).toDateString()}
                                </Text>
                            </Section>
                            <Section className="bg-slate-300 rounded-md p-3">
                                <Text className="italic text-sm text-slate-600">
                                    {quote}
                                </Text>
                                <Text className="text-right pt-3 italic font-slate-400 text-sm capitalize">
                                    -- {author}
                                </Text>
                            </Section>
                        </Container>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default CloseReferralEmailToReferee
