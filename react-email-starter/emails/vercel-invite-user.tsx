import {
    Body,
    Column,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Row,
    Section,
    Tailwind,
    Link,
    Img,
    Text
} from '@react-email/components'
import * as React from 'react'

interface VercelInviteUserEmailProps {
    username?: string
    userImage?: string
    invitedByUsername?: string
    invitedByEmail?: string
    teamName?: string
    teamImage?: string
    inviteLink?: string
    inviteFromIp?: string
    inviteFromLocation?: string
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : ''

export const VercelInviteUserEmail = ({
    username = 'zenorocha',
    userImage = `${baseUrl}/static/vercel-user.png`,
    invitedByUsername = 'bukinoshita',
    invitedByEmail = 'bukinoshita@example.com',
    teamName = 'My Project',
    teamImage = `${baseUrl}/static/vercel-team.png`,
    inviteLink = 'https://vercel.com/teams/invite/foo',
    inviteFromIp = '204.13.186.218',
    inviteFromLocation = 'São Paulo, Brazil'
}: VercelInviteUserEmailProps) => {
    const previewText = `Join ${invitedByUsername} on Vercel`
    const quote = {
        id: 'c7c03bd0-525c-441f-a291-95938f90eab2',
        lines: [
            {
                perks: [
                    {
                        value: 14.99,
                        description:
                            'The Disney Bundle is the “Something for Everyone” streaming solution from The Walt Disney Company. With the Disney Bundle through Verizon, you get access to thousands of movies, hit series and exclusive sports with subscriptions to Disney+ (No Ads), Hulu (With Ads) and ESPN+ (With Ads).',
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-disney-bundle-1x1-small?fmt=webp-alpha&scl=2',
                        name: 'disney bundle',
                        selected: false,
                        sharabled: true,
                        price: 10
                    },
                    {
                        sharabled: false,
                        description:
                            'A Mobile Hotspot lets you share your Verizon network connection with other devices so they can access the internet. Devices connect to your Mobile Hotspot using Wi-Fi. While devices are connected, you’re charged for any data they use according to your monthly data plan.',
                        value: 45,
                        price: 10,
                        name: '100 GB mobile hotspot',
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-mobile-hotspot-1x1-small?fmt=webp-alpha&scl=2',
                        selected: false
                    },
                    {
                        selected: false,
                        price: 10,
                        sharabled: false,
                        value: 16.95,
                        image: 'https://www.apple.com/v/apple-one/d/images/meta/og__diu4z5hyr8ia_overview.png',
                        name: 'apple one',
                        description:
                            'Apple One bundles together Apple Music®, Apple TV+®, Apple Arcade®, and iCloud+℠ with up to 200 GB of storage. Plus, it’s all ad-free. \n Apple One is available as an Individual or Family subscription through Verizon.'
                    },
                    {
                        value: 12.95,
                        sharabled: true,
                        selected: false,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/walmart_pop_plans_d?fmt=webp-alpha&scl=2',
                        name: 'walmart+ membership',
                        price: 10,
                        description:
                            'Walmart+ is a membership from Walmart that gives you access to lots of benefits that will help you save time and money.'
                    },
                    {
                        description: 'this a description for the perk',
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-apple-music-family-1x1-small?fmt=webp-alpha&scl=2',
                        name: 'apple music family',
                        value: 16.99,
                        price: 10,
                        sharabled: true,
                        selected: false
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-smartwatch-data-safety-3x2-small?scl=2.5&fmt=webp',
                        name: 'smartwatch data & safety',
                        sharabled: false,
                        price: 10,
                        value: 20,
                        description:
                            'Connected device plans are monthly data plans for your non-phone devices (i.e., mobile hotspot devices, USB modems, tablets, laptops, smartwatches, security cameras, in-car Wi-Fi, and more).',
                        selected: false
                    },
                    {
                        price: 10,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-plus-play-monthly-credit-3x2-small?scl=2.5&fmt=webp',
                        name: '+play monthly credit',
                        value: 15,
                        selected: false,
                        sharabled: false,
                        description:
                            'Get $15 to spend each month on your favorite +play subscriptions for just $10. Get Netflix, Xbox Game Pass, HBO Max, Paramount+, MasterClass, and more - for less!'
                    },
                    {
                        price: 10,
                        sharabled: true,
                        description:
                            'Get $15 to spend each month on your favorite +play subscriptions for just $10. Get Netflix, Xbox Game Pass, HBO Max, Paramount+, MasterClass, and more - for less!',
                        name: '2 TB cloud storage',
                        selected: false,
                        value: 14.99,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-two-tb-cloud-storage-3x2-small?scl=2.5&fmt=webp'
                    },
                    {
                        selected: false,
                        description:
                            'TravelPass lets you use your domestic talk, text and data* in 210+ countries and destinations outside the US. You can call within the country you’re visiting and you can call back to the US.',
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-three-travelpass-days-3x2-small?scl=2.5&fmt=webp',
                        name: '3 TravelPass Days',
                        value: 30,
                        sharabled: false,
                        price: 10
                    }
                ],
                id: 'cfefb4d5-c44b-4eb1-b783-125d590f6ff3',
                price: 40,
                name: 'Unlimited Welcome',
                byod: false
            },
            {
                name: 'Unlimited Ultimate',
                byod: true,
                id: 'b22f3b98-0e27-4cfc-81bc-0b6a4eaceb2d',
                perks: [
                    {
                        price: 10,
                        sharabled: true,
                        selected: false,
                        description:
                            'The Disney Bundle is the “Something for Everyone” streaming solution from The Walt Disney Company. With the Disney Bundle through Verizon, you get access to thousands of movies, hit series and exclusive sports with subscriptions to Disney+ (No Ads), Hulu (With Ads) and ESPN+ (With Ads).',
                        name: 'disney bundle',
                        value: 14.99,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-disney-bundle-1x1-small?fmt=webp-alpha&scl=2'
                    },
                    {
                        sharabled: false,
                        price: 10,
                        name: '100 GB mobile hotspot',
                        selected: false,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-mobile-hotspot-1x1-small?fmt=webp-alpha&scl=2',
                        value: 45,
                        description:
                            'A Mobile Hotspot lets you share your Verizon network connection with other devices so they can access the internet. Devices connect to your Mobile Hotspot using Wi-Fi. While devices are connected, you’re charged for any data they use according to your monthly data plan.'
                    },
                    {
                        name: 'apple one',
                        selected: false,
                        value: 16.95,
                        sharabled: false,
                        price: 10,
                        description:
                            'Apple One bundles together Apple Music®, Apple TV+®, Apple Arcade®, and iCloud+℠ with up to 200 GB of storage. Plus, it’s all ad-free. \n Apple One is available as an Individual or Family subscription through Verizon.',
                        image: 'https://www.apple.com/v/apple-one/d/images/meta/og__diu4z5hyr8ia_overview.png'
                    },
                    {
                        selected: false,
                        name: 'walmart+ membership',
                        value: 12.95,
                        price: 10,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/walmart_pop_plans_d?fmt=webp-alpha&scl=2',
                        description:
                            'Walmart+ is a membership from Walmart that gives you access to lots of benefits that will help you save time and money.',
                        sharabled: true
                    },
                    {
                        description: 'this a description for the perk',
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-apple-music-family-1x1-small?fmt=webp-alpha&scl=2',
                        price: 10,
                        value: 16.99,
                        name: 'apple music family',
                        sharabled: true,
                        selected: true
                    },
                    {
                        value: 20,
                        description:
                            'Connected device plans are monthly data plans for your non-phone devices (i.e., mobile hotspot devices, USB modems, tablets, laptops, smartwatches, security cameras, in-car Wi-Fi, and more).',
                        name: 'smartwatch data & safety',
                        price: 10,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-smartwatch-data-safety-3x2-small?scl=2.5&fmt=webp',
                        sharabled: false,
                        selected: false
                    },
                    {
                        value: 15,
                        description:
                            'Get $15 to spend each month on your favorite +play subscriptions for just $10. Get Netflix, Xbox Game Pass, HBO Max, Paramount+, MasterClass, and more - for less!',
                        selected: false,
                        name: '+play monthly credit',
                        price: 10,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-plus-play-monthly-credit-3x2-small?scl=2.5&fmt=webp',
                        sharabled: false
                    },
                    {
                        name: '2 TB cloud storage',
                        selected: false,
                        price: 10,
                        description:
                            'Get $15 to spend each month on your favorite +play subscriptions for just $10. Get Netflix, Xbox Game Pass, HBO Max, Paramount+, MasterClass, and more - for less!',
                        value: 14.99,
                        sharabled: true,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-two-tb-cloud-storage-3x2-small?scl=2.5&fmt=webp'
                    },
                    {
                        price: 10,
                        name: '3 TravelPass Days',
                        value: 30,
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-three-travelpass-days-3x2-small?scl=2.5&fmt=webp',
                        description:
                            'TravelPass lets you use your domestic talk, text and data* in 210+ countries and destinations outside the US. You can call within the country you’re visiting and you can call back to the US.',
                        sharabled: false,
                        selected: false
                    }
                ],
                price: 60
            },
            {
                id: 'bb0246a8-6933-45c1-95a1-769c8d88c9fb',
                name: 'Unlimited Welcome',
                price: 45,
                byod: true,
                perks: [
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-disney-bundle-1x1-small?fmt=webp-alpha&scl=2',
                        name: 'disney bundle',
                        price: 10,
                        sharabled: true,
                        value: 14.99,
                        selected: true,
                        description:
                            'The Disney Bundle is the “Something for Everyone” streaming solution from The Walt Disney Company. With the Disney Bundle through Verizon, you get access to thousands of movies, hit series and exclusive sports with subscriptions to Disney+ (No Ads), Hulu (With Ads) and ESPN+ (With Ads).'
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-mobile-hotspot-1x1-small?fmt=webp-alpha&scl=2',
                        name: '100 GB mobile hotspot',
                        price: 10,
                        value: 45,
                        selected: false,
                        sharabled: false,
                        description:
                            'A Mobile Hotspot lets you share your Verizon network connection with other devices so they can access the internet. Devices connect to your Mobile Hotspot using Wi-Fi. While devices are connected, you’re charged for any data they use according to your monthly data plan.'
                    },
                    {
                        image: 'https://www.apple.com/v/apple-one/d/images/meta/og__diu4z5hyr8ia_overview.png',
                        name: 'apple one',
                        price: 10,
                        sharabled: false,
                        value: 16.95,
                        selected: false,
                        description:
                            'Apple One bundles together Apple Music®, Apple TV+®, Apple Arcade®, and iCloud+℠ with up to 200 GB of storage. Plus, it’s all ad-free. \n Apple One is available as an Individual or Family subscription through Verizon.'
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/walmart_pop_plans_d?fmt=webp-alpha&scl=2',
                        name: 'walmart+ membership',
                        price: 10,
                        selected: false,
                        sharabled: true,
                        value: 12.95,
                        description:
                            'Walmart+ is a membership from Walmart that gives you access to lots of benefits that will help you save time and money.'
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-apple-music-family-1x1-small?fmt=webp-alpha&scl=2',
                        name: 'apple music family',
                        price: 10,
                        selected: false,
                        value: 16.99,
                        sharabled: true,
                        description: 'this a description for the perk'
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-smartwatch-data-safety-3x2-small?scl=2.5&fmt=webp',
                        name: 'smartwatch data & safety',
                        price: 10,
                        value: 20,
                        selected: false,
                        sharabled: false,
                        description:
                            'Connected device plans are monthly data plans for your non-phone devices (i.e., mobile hotspot devices, USB modems, tablets, laptops, smartwatches, security cameras, in-car Wi-Fi, and more).'
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-plus-play-monthly-credit-3x2-small?scl=2.5&fmt=webp',
                        name: '+play monthly credit',
                        price: 10,
                        selected: false,
                        value: 15,
                        sharabled: false,
                        description:
                            'Get $15 to spend each month on your favorite +play subscriptions for just $10. Get Netflix, Xbox Game Pass, HBO Max, Paramount+, MasterClass, and more - for less!'
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-two-tb-cloud-storage-3x2-small?scl=2.5&fmt=webp',
                        name: '2 TB cloud storage',
                        price: 10,
                        selected: false,
                        value: 14.99,
                        sharabled: true,
                        description:
                            'Get $15 to spend each month on your favorite +play subscriptions for just $10. Get Netflix, Xbox Game Pass, HBO Max, Paramount+, MasterClass, and more - for less!'
                    },
                    {
                        image: 'https://ss7.vzw.com/is/image/VerizonWireless/perk-tile-three-travelpass-days-3x2-small?scl=2.5&fmt=webp',
                        name: '3 TravelPass Days',
                        price: 10,
                        selected: false,
                        sharabled: false,
                        value: 30,
                        description:
                            'TravelPass lets you use your domestic talk, text and data* in 210+ countries and destinations outside the US. You can call within the country you’re visiting and you can call back to the US.'
                    }
                ]
            }
        ],
        userId: 'lMhWmEcsHfU3hkcWNkcDhecofKF2',
        createdAt: '2023-10-09T02:27:24.353Z',
        customerName: 'Juan Almonte',
        email: 'juan.almonte@aol.com',
        phoneNumber: '(917) 457-8989',
        status: 'pending',
        isAutoPay: true,
        isFirstResponder: false,
        hasFios: true,
        hasGig: false,
        message: 'new message'
    }

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-200 mx-auto font-sans items-center justify-center flex flex-col w-full">
                    <Container className="items-center flex justify-center w-full">
                        <Text className="text-2xl my-4 font-semibold">
                            Hi {quote.customerName.split(' ')[0]}, I hope this
                            email finds you well.
                        </Text>
                        <Text className="text-xl my-4 font-bold text-center">
                            Here is your Verizon Wireless quote:
                        </Text>
                    </Container>
                    <Container className="items-center bg-slate-100 p-6 rounded-md mx-auto max-w-2xl justify-center">
                        <Hr />
                        <Text className="text-center text-lg font-semibold my-2">
                            Number of Line {quote.lines.length}
                        </Text>
                        <Section>
                            {quote.lines.map((line, index) => (
                                <Section
                                    key={index}
                                    className="rounded-md shadow-md bg-slate-300 my-3"
                                >
                                    <Row className="justify-between items-center px-4">
                                        <Column className="w-full">
                                            <Text className=" font-semibold">
                                                {index + 1} - {line.name}
                                            </Text>
                                        </Column>
                                        <Column>
                                            <Text className="font-semibold">
                                                ${line.price}
                                            </Text>
                                        </Column>
                                    </Row>
                                    {line.perks
                                        .filter((a) => a.selected)
                                        .map((perk, i) => (
                                            <Row
                                                key={i}
                                                className="justify-between items-center px-4 py-0"
                                            >
                                                <Column className="px-6">
                                                    <Text className="text-sm  text-gray-500 font-semibold">
                                                        {perk.name}
                                                    </Text>
                                                </Column>
                                                <Column>
                                                    <Text className="text-sm text-gray-500 font-semibold">
                                                        {perk.price}
                                                    </Text>
                                                </Column>
                                            </Row>
                                        ))}
                                </Section>
                            ))}
                        </Section>
                        <Section className="p-2 bg-white shadow-md  rounded-md mx-auto mt-3">
                            <Row className="justify-between items-center px-4 py-0">
                                <Column className="w-full">
                                    <Text className="text-lg font-bold">
                                        Sub-Total
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-lg font-bold">
                                        $190
                                    </Text>
                                </Column>
                            </Row>
                            {quote.lines.map(
                                (line) =>
                                    line.perks.filter((a) => a.selected)
                                        .length > 0
                            ) && (
                                <Row className="justify-between items-center px-4 py-0">
                                    <Column className="w-full">
                                        <Text className="text-md">
                                            Perks (
                                            {
                                                quote.lines.map((line) =>
                                                    line.perks.filter(
                                                        (a) => a.selected
                                                    )
                                                ).length
                                            }
                                            )
                                        </Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-md">
                                            $
                                            {quote.lines.map((line) =>
                                                line.perks.filter(
                                                    (a) => a.selected
                                                )
                                            ).length * 10}
                                        </Text>
                                    </Column>
                                </Row>
                            )}
                            {quote.isAutoPay && (
                                <Row className="justify-between items-center px-4 py-0 w-full">
                                    <Column className="w-['70%]">
                                        <Text className="text-md">
                                            Auto Pay
                                        </Text>
                                    </Column>
                                    <Column className="flex justify-end">
                                        <Text className="text-md">-$60</Text>
                                    </Column>
                                </Row>
                            )}

                            {quote.email && (
                                <Row className="justify-between items-center px-4 py-0 w-full">
                                    <Column className="w-[60%]">
                                        <Text className="text-md">
                                            BYOD Savings
                                        </Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-sm">
                                            Savings (10)
                                        </Text>
                                    </Column>
                                    <Column className="flex justify-end">
                                        <Text className="text-md">-$30</Text>
                                    </Column>
                                </Row>
                            )}
                            {quote.hasFios && (
                                <Row className="justify-between items-center px-4 py-0">
                                    <Column className="w-full">
                                        <Text className="text-md">
                                            First Responder Discount
                                        </Text>
                                    </Column>
                                    <Column className="flex justify-end">
                                        <Text className="text-md">-$20</Text>
                                    </Column>
                                </Row>
                            )}
                            {quote.hasFios && (
                                <Row className="justify-between items-center px-4 py-0">
                                    <Column className="w-full">
                                        <Text className="text-md">
                                            Mobile + Home Discount
                                        </Text>
                                    </Column>
                                    <Column className="flex justify-end">
                                        <Text className="text-md">-$20</Text>
                                    </Column>
                                </Row>
                            )}
                            <Row className="justify-between items-center px-4 py-0">
                                <Column className="w-full">
                                    <Text className="text-2xl font-semibold">
                                        Total
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-2xl font-semibold">
                                        $80
                                    </Text>
                                </Column>
                            </Row>
                            <Container className="flex align-middle self-center justify-center w-full my-4">
                                <Link
                                    className="shadow-md bg-slate-600  text-white font-bold py-2 px-6 rounded-full text-md"
                                    href="tel:+17205544555"
                                >
                                    Call Me
                                </Link>
                            </Container>
                        </Section>
                        <Text className="text-md mb-4  text-center">
                            Thank you {quote.customerName.split(' ')[0]} for
                            your interest in Verizon Wireless
                        </Text>
                        <Hr />

                        <Text className="text-md my-2  text-center italic">
                            Note: This quote was created on{' '}
                            {new Date(quote.createdAt).toDateString()}, pricng
                            might change at anytime.
                        </Text>
                    </Container>
                    <Container>
                        <Text className="font-thin">
                            <b>Disclaimer: </b>
                            The wireless quote you received was created solely
                            for illustrative purposes to give you an approximate
                            idea of the potential cost associated with the
                            service. Please be aware that this quote is not an
                            official quote from Verizon It was generated based
                            on our internal calculations, assumptions and any
                            conversation we might have had.
                        </Text>
                    </Container>
                    <Container>
                        <Text className="font-thin text-sm my-2 italic">
                            <b>BYOD. </b>
                            Bring Your Phone Discount. Unlimited Ultimate: Plan
                            price includes $540 promo credit per phone applied
                            over 36 mos. when you add 1-4 new smartphone lines
                            with your own 4G/5G smartphone. Unlimited Plus: Plan
                            price includes $360 promo credit per phone applied
                            over 36 mos. when you add 1-4 new smartphone lines
                            with your own 4G/5G smartphone. Unlimited Welcome:
                            Plan price includes $180 promo credit per phone
                            applied over 36 mos for new customers activating a
                            new smartphone line with your own 4G/5G smartphone.
                            All promo credits end if eligibility req’s are no
                            longer met. Limited time offer.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default VercelInviteUserEmail
