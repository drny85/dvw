import {
    Body,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Section,
    Text
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
export type WirelessClosedTemplateProps = {
    customerName: string
    repPhone: string
    repName: string
}
export const WirelessClosedTemplate = ({
    customerName,
    repPhone,
    repName
}: WirelessClosedTemplateProps) => {
    const firstName =
        customerName?.split(' ')[0].charAt(0).toUpperCase() +
        customerName?.split(' ')[0].slice(1)
    const previewText = `Thank You  ${firstName}!`

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-200  my-auto mx-auto font-sans px-2">
                    <Container className="border shadow-md border-solid border-[#eaeadd] rounded my-[40px] mx-auto p-[20px] max-w-[720px]">
                        <Text className="text-center text-xl font-bold">
                            Thank you for your Verizon Wireless Order
                        </Text>
                        <Text>
                            Hello {firstName}, I would like to personally thank
                            you for placing your order with me and welcome you
                            to the Verizon Family. I know you will love the
                            services.
                        </Text>
                        <Text>
                            I have taken the liberty of including some helpful
                            information and self-service options to make the
                            transition a great experience for you.
                        </Text>
                        <Section className="shadow-md p-4 rounded-md bg-slate-300">
                            <Text>
                                1. As soon as you activate your Verizon service
                                please download the My Verizon App or set up
                                your account online at {' '}
                                <Link
                                    href="https://secure.verizon.com/accessmanager/public/c/reg/start/"
                                    target={'_blank'}
                                >
                                    Verizon Wireless Register
                                </Link>
                            </Text>
                            <Text>
                                2. To receive the Autopay Discount please ensure
                                you are using a Debit Card or ACH from Checking
                                account (Credit Cards not eligible). 
                                <Link
                                    target={'_blank'}
                                    href="https://www.verizon.com/support/how-to-set-up-auto-pay-video/#:~:text=Set%20up%20is%20quick%20and,and%20then%20click%20Auto%20Pay"
                                >
                                    {' '}
                                    Auto Pay Tutorial
                                </Link>
                            </Text>
                            <Text>
                                3. If any Employee or Special Discounts apply
                                you can validate them online or through the app {' '}
                                <Link href="https://www.verizon.com/onesearch/search?q=Employee%20Discount&lid=sayt&sayt=employee*&src=wireless&ES=support">
                                    Additional Discounts
                                </Link>
                            </Text>
                            <Text>
                                4. If you qualified for a Rebate / Verizon Gift
                                Card you will need to claim it within the first
                                30 days of active services here - {' '}
                                <Link
                                    target={'_blank'}
                                    href="https://www.yourdigitalrebatecenter.com/#!/"
                                >
                                    Digital Rebate Center
                                </Link>
                            </Text>
                            <Text>
                                5. If you Ported numbers to Verizon, you can
                                check the status here {' '}
                                <Link
                                    href="https://www.verizon.com/digital/nsa/nos/ui/acct/portintent/switchtoverizon/#/"
                                    target={'_blank'}
                                >
                                    Verizon Port
                                </Link>{' '}
                                 or call Port at {' '}
                                <Link href={'tel:+1-888-866-6907'}>
                                    888-866-6907
                                </Link>
                            </Text>
                            <Text>
                                6. If you need to trade-in a device, you may
                                start here {' '}
                                <Link
                                    href="https://www.verizon.com/sales/digital/tradein.html"
                                    target={'_blank'}
                                >
                                    Start a Trade-in
                                </Link>
                                . Check the status of a Trade-in or request a
                                new shipping label here. {' '}
                                <Link
                                    href="https://www.verizon.com/sales/digital/tradeinstatus.html"
                                    target={'_blank'}
                                >
                                    Trade In Status
                                </Link>
                            </Text>
                            <Text>
                                8. Any billing questions or inquiries now or in
                                the future you can reach Customer Care at {' '}
                                <Link href="tel:+1-800-392-0717">
                                    800-392-0717{' '}
                                </Link>
                                  seven days a week.
                            </Text>
                        </Section>
                        <Section className="spacing-y-0">
                            <Text className="text-md">
                                Your Dedicated Verizon Specialist
                            </Text>
                            <Text className="font-bold text-lg capitalize">
                                {repName}
                            </Text>
                            <Link href={`tel:+1${repPhone}`}>{repPhone}</Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default WirelessClosedTemplate
