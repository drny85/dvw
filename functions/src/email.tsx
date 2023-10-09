import {
    Body,
    Container,
    Head,
    Html,
    Hr,
    Preview,
    Column,
    Row,
    Section,
    Link,
    Text
} from '@react-email/components'
import * as React from 'react'
import { Tailwind } from '@react-email/tailwind'
import { WirelessQuote } from './typing'
import {
    byodSavings,
    firstResponderDiscount,
    loyaltyBonusDiscount,
    totalPerksCount
} from './utils'

const WirelessQuoteEmail: React.FC<Readonly<WirelessQuote>> = ({
    createdAt,
    customerName,
    hasFios,
    internetPlan,
    isAutoPay,
    isFirstResponder,
    lines,
    emPhone
}) => {
    const total = (): number =>
        lines.reduce((acc, line) => acc + line.price, 0) -
        firstResponderDiscount(lines.length, isFirstResponder)
    const byod = byodSavings(lines)
    const autoPayDiscount = (): number => {
        return isAutoPay ? lines.length * 10 : 0
    }
    const perksSavings = (): number => {
        return lines
            .map((line) =>
                line.perks.map((perk) =>
                    perk.selected ? perk.value - perk.price : 0
                )
            )
            .flat()
            .reduce((acc, perks) => acc + perks, 0)
    }
    const firstResponder = (): number =>
        firstResponderDiscount(lines.length, isFirstResponder)

    const perksTotal = (): number => {
        return lines
            .map((line) =>
                line.perks.map((perk) => (perk.selected ? perk.price : 0))
            )
            .flat()
            .reduce((acc, perks) => acc + perks, 0)
    }

    const loyalty = loyaltyBonusDiscount(lines, internetPlan, hasFios)

    const subTotal = (): number =>
        lines.reduce((acc, line) => acc + line.price, 0) +
        mobilePlusHomeDiscount() +
        autoPayDiscount() +
        loyalty +
        byod

    const mobilePlusHomeDiscount = (): number => {
        return lines
            .map((line) =>
                (line.name === 'Unlimited Plus' ||
                    line.name === 'Unlimited Ultimate') &&
                hasFios &&
                (internetPlan === '2gig' || internetPlan === 'gig')
                    ? { discount: 10 }
                    : (line.name === 'Unlimited Plus' ||
                          line.name === 'Unlimited Ultimate') &&
                      hasFios &&
                      internetPlan !== '2gig' &&
                      internetPlan !== 'gig'
                    ? { discount: 5 }
                    : line.name === 'Unlimited Welcome' && hasFios
                    ? { discount: 5 }
                    : { discount: 0 }
            )
            .reduce((acc, line) => acc + line.discount, 0)
    }

    return (
        <Html>
            <Head />
            <Preview>
                Your Verizon Wireless Quote from your Verizon Specialist
            </Preview>
            <Tailwind>
                <Body className="bg-white mx-auto font-sans items-center justify-center w-full flex flex-col">
                    <Container className="items-center flex justify-center w-full">
                        <Text className="text-2xl my-4 font-semibold">
                            Hi {customerName.split(' ')[0]}, I hope this email
                            finds you well.
                        </Text>
                        <Text className="text-xl my-4 font-bold text-center">
                            Here is your Verizon Wireless quote:
                        </Text>
                    </Container>
                    <Container className="items-center bg-slate-100 p-6 rounded-md mx-auto max-w-2xl justify-center">
                        <Hr />
                        <Text className="text-center text-lg font-semibold my-2">
                            Number of Lines {lines.length}
                        </Text>
                        <Section>
                            {lines.map((line, index) => (
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
                                                    <Text className="text-sm  text-gray-500 font-semibold capitalize">
                                                        {perk.name}
                                                    </Text>
                                                </Column>
                                                <Column>
                                                    <Text className="text-sm text-gray-500 font-semibold">
                                                        ${perk.price}
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
                                        ${subTotal()}
                                    </Text>
                                </Column>
                            </Row>
                            {perksTotal() > 0 && (
                                <Row className="justify-between items-center px-4 py-0 w-full">
                                    <Column className="w-[60%]">
                                        <Text className="text-md">
                                            Perks ({totalPerksCount(lines)})
                                        </Text>
                                    </Column>
                                    <Column className="w-full">
                                        <Text className="text-sm">
                                            Savings ({perksSavings().toFixed(2)}
                                            )
                                        </Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-md">
                                            ${perksTotal()}
                                        </Text>
                                    </Column>
                                </Row>
                            )}

                            {isAutoPay && (
                                <Row className="justify-between items-center px-4 py-0 w-full">
                                    <Column className="w-['70%]">
                                        <Text className="text-md">
                                            Auto Pay
                                        </Text>
                                    </Column>
                                    <Column className="flex justify-end">
                                        <Text className="text-md">
                                            -${autoPayDiscount()}
                                        </Text>
                                    </Column>
                                </Row>
                            )}
                            {firstResponder() > 0 && isFirstResponder && (
                                <Row className="justify-between items-center px-4 py-0">
                                    <Column className="w-['70%]">
                                        <Text className="text-md">
                                            First Responder Discount
                                        </Text>
                                    </Column>
                                    <Column className="flex justify-end">
                                        <Text className="text-md">
                                            -${firstResponder()}
                                        </Text>
                                    </Column>
                                </Row>
                            )}
                            {byod > 0 && (
                                <Row className="justify-between items-center px-4 py-0 w-full">
                                    <Column className="w-['70%]">
                                        <Text className="text-md">
                                            BYOD Savings -
                                        </Text>
                                    </Column>

                                    <Column className="flex justify-end">
                                        <Text className="text-md">
                                            -${byod}
                                        </Text>
                                    </Column>
                                </Row>
                            )}
                            {loyalty > 0 && (
                                <Row className="justify-between items-center px-4 py-0 w-full">
                                    <Column className="w-['70%]">
                                        <Text className="text-md">
                                            Loyalty Discount
                                        </Text>
                                    </Column>

                                    <Column className="flex justify-end">
                                        <Text className="text-md">
                                            -${loyalty}
                                        </Text>
                                    </Column>
                                </Row>
                            )}

                            {mobilePlusHomeDiscount() > 0 && (
                                <Row className="justify-between items-center px-4 py-0">
                                    <Column className="w-['70%]">
                                        <Text className="text-md">
                                            Mobile + Home Discount
                                        </Text>
                                    </Column>
                                    <Column className="flex justify-end">
                                        <Text className="text-md">
                                            -${mobilePlusHomeDiscount()}
                                        </Text>
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
                                        ${total()}
                                    </Text>
                                </Column>
                            </Row>
                            {emPhone && (
                                <Container className="flex align-middle self-center justify-center w-full my-4">
                                    <Link
                                        className="shadow-md bg-slate-600  text-white font-bold py-2 px-6 rounded-full text-md"
                                        href={`tel:${emPhone.replace(
                                            /[^0-9]/g,
                                            ''
                                        )}`}
                                    >
                                        Call Me
                                    </Link>
                                </Container>
                            )}
                        </Section>
                        <Text className="text-md mb-4  text-center">
                            Thank you {customerName.split(' ')[0]} for your
                            interest in Verizon Wireless
                        </Text>

                        <Hr />

                        <Text className="text-md my-2  text-center italic">
                            Note: This quote was created on{' '}
                            {new Date(createdAt).toDateString()}, prices may be
                            changed at any time.
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
                    {byod > 0 && (
                        <Container>
                            <Text className="font-thin text-sm my-2 italic">
                                <b>BYOD. </b>
                                Bring Your Phone Discount. Unlimited Ultimate:
                                Plan price includes $540 promo credit per phone
                                applied over 36 mos. when you add 1-4 new
                                smartphone lines with your own 4G/5G smartphone.
                                Unlimited Plus: Plan price includes $360 promo
                                credit per phone applied over 36 mos. when you
                                add 1-4 new smartphone lines with your own 4G/5G
                                smartphone. Unlimited Welcome: Plan price
                                includes $180 promo credit per phone applied
                                over 36 mos for new customers activating a new
                                smartphone line with your own 4G/5G smartphone.
                                All promo credits end if eligibility req’s are
                                no longer met. Limited time offer.
                            </Text>
                        </Container>
                    )}
                </Body>
            </Tailwind>
        </Html>
    )
}

export { WirelessQuoteEmail }
