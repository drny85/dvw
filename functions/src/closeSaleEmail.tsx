import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import * as moment from 'moment'
import { Referral } from './typing'

export const SendCloseEmail = ({
    name,

    mon,
    due_date,
    order_date,
    address,
    apt,
    phone,
    isVerizonWirelessCustomer,
    comment,
    moveIn,
    email,
    package: service,
    referee,
    type
}: Referral) => {
    const previewText = `This Sale Has Been Closed`

    const services = generatePackage(service)

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-200  my-auto mx-auto font-sans px-2">
                    <Container className="border shadow-md border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[720px]">
                        <Heading className="text-black  text-2xl font-bold text-center capitalize p-0 my-[30px] mx-0">
                            This Sale has been closed
                        </Heading>
                        <Text className="text-black text-center text-xl capitalize">
                            {name}
                        </Text>
                        <Section>
                            <Text className="font-bold">MON: {mon}</Text>
                            <Text>
                                Moving Date: {moment(moveIn).format('ll')}
                            </Text>
                            <Text>
                                Order Date: {moment(order_date).format('ll')}
                            </Text>
                            <Text className="font-bold">
                                Due Date: {moment(due_date).format('ll')}
                            </Text>

                            <Text>Services Ordered: {services}</Text>

                            <Text>Address: {address}</Text>
                            {apt && (
                                <Text className="uppercase">Apt: {apt}</Text>
                            )}
                            <Text>
                                Phone:{' '}
                                <Link href={`tel:${phone}`}>{phone}</Link>
                            </Text>

                            <Text>
                                Email:{' '}
                                <Link href={`mailto:${email}`}>{email}</Link>
                            </Text>

                            <Text>
                                Is a VZW Customer:{' '}
                                {isVerizonWirelessCustomer ? 'Yes' : 'NO'}
                            </Text>
                            <Text>Referred By: {referee?.name}</Text>
                            <Text className="capitalize">
                                Order Type: {type}
                            </Text>
                        </Section>
                        <Text className="font-bold">Comments / Notes</Text>
                        <Section className="shadow-md rounded-md bg-slate-300 px-4">
                            <Text className="text-black font-italic">
                                {comment}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default SendCloseEmail

const generatePackage = (serive: Referral['package']) => {
    {
        serive && serive.internet && serive.internet.name + ', '
    }
    {
        serive && serive.tv && serive.tv.name + ', '
    }
    {
        serive && serive.home && serive.home.name
    }
    if (!serive) {
        return null
    }
    const i = serive && serive.internet ? serive.internet.name : ''
    const tv = serive && serive.tv ? serive.tv.name : ''
    const ph = serive && serive.home ? serive.home.name : ''
    const wireless = serive && serive.wireless ? serive.wireless.name : ''

    const final = i + ' ' + tv + ' ' + ph + ' ' + wireless

    return final
}
