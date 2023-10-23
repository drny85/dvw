import React, { Component, ErrorInfo, ReactNode } from 'react'
import Screen from './Screen'
import View from './View'
import Text from './Text'
import { SIZES } from '@/constants/Sizes'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
}

class ErrorComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can log the error or send it to a logging service
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({ hasError: true })
    }

    render() {
        if (this.state.hasError) {
            // You can customize the error message or UI here
            return (
                <Screen>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: SIZES.padding
                        }}
                    >
                        <Text>Oops!</Text>
                        <Text>Something went wrong.</Text>
                        <Text>Please try again later</Text>
                    </View>
                </Screen>
            )
        }

        return this.props.children
    }
}

export default ErrorComponent
