import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Heading,
    Preview,
    Section,
    Tailwind,
    Text
} from '@react-email/components'
import * as React from 'react'

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : ''

interface StripeWelcomeEmailProps {
    customer: string
    numberOfLines: number
}
export const StripeWelcomeEmail = ({
    customer,
    numberOfLines
}: StripeWelcomeEmailProps) => {
    const currentTime = new Date()
    const currentHour = currentTime.getHours()

    function getTimeBasedGreeting() {
        let greeting

        if (currentHour >= 5 && currentHour < 12) {
            greeting = 'Good morning'
        } else if (currentHour >= 12 && currentHour < 17) {
            greeting = 'Good afternoon'
        } else if (currentHour >= 17 && currentHour < 21) {
            greeting = 'Good evening'
        } else {
            greeting = 'Good night'
        }

        return greeting
    }
    return (
        <Html>
            <Head />
            <Preview>
                You're now ready to make live transactions with Stripe!
            </Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: '#007291',
                                background: '#ffffff'
                            }
                        }
                    }
                }}
            >
                <Body className="min-h-screen w-full p-10 bg-gray-300 "></Body>
            </Tailwind>
        </Html>
    )
}

export default StripeWelcomeEmail

const box = {
    padding: '0 48px'
}

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0'
}

const paragraph = {
    color: '#525f7f',

    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const
}

const anchor = {
    color: '#556cd6'
}

const button = {
    backgroundColor: '#656ee8',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%'
}

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px'
}
