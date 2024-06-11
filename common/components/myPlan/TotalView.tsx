import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import {
    LOYALTY_EXPIRATION_DATE,
    WELCOME_OFFER_EXPIRATION_DATE
} from '@/constants'
import { SIZES } from '@/constants/Sizes'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    setLinesData,
    toggleIsWelcomeQualified
} from '@/features/wireless/wirelessSlide'
import { byodSavings } from '@/utils/byodSavings'
import { firstResponderDiscount } from '@/utils/firstResponderDiscount'
import { totalPerksCount } from '@/utils/perksCount'
import { useRouter } from 'expo-router'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'
import React, { useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Divider from '../Divider'
import Row from '../Row'
import Text from '../Text'
import View from '../View'
import { FontAwesome } from '@expo/vector-icons'
import useThemeColor from '@/common/hooks/useThemeColor'

type Props = {
    showResetAll?: boolean
    onClickSave: () => void
}
const TotalView = ({ onClickSave, showResetAll }: Props) => {
    const router = useRouter()
    const iconColor = useThemeColor('text')
    const lines = useAppSelector((s) => s.wireless.lines)
    const isWelcome = useAppSelector((s) => s.wireless.isWelcome)
    const dispatch = useAppDispatch()
    const [showTradeInDetails, setShowTradeInDetails] = useState(false)

    const {
        expressFirstResponder,
        expressAutoPay,
        expressHasFios,
        expressInternet
    } = useAppSelector((s) => s.wireless)
    const welcomeTotal = lines.filter(
        (l) => l.name === 'Unlimited Welcome'
    ).length

    const welcomeOfferBonus = (): number => {
        if (welcomeTotal === 0 || !isWelcome || lines.length > 3) return 0
        if (
            new Date(WELCOME_OFFER_EXPIRATION_DATE).getTime() <
            new Date().getTime()
        )
            return 0

        return welcomeTotal === 1
            ? 10
            : welcomeTotal === 2
            ? 15
            : welcomeTotal === 3
            ? 20
            : welcomeTotal === 0
            ? 0
            : 0
    }

    const byod = byodSavings(lines)
    const tradeInTotal = (): number => {
        return (
            lines
                .filter((i) => i.tradeIn && i.tradeInValues !== null)
                .map((line) => line.tradeInValues)
                .reduce((acc, tradeIn) => acc + tradeIn?.monthlyPrice!, 0) || 0
        )
    }

    const firstResponder = (): number =>
        firstResponderDiscount(lines.length, expressFirstResponder)

    const total = (): number =>
        lines.reduce((acc, line) => acc + line.price, 0) -
        firstResponderDiscount(lines.length, expressFirstResponder) -
        welcomeOfferBonus() +
        tradeInTotal()

    const mobilePlusHomeDiscount = (): number => {
        return lines
            .map((line) =>
                (line.name === 'Unlimited Plus' ||
                    line.name === 'Unlimited Ultimate') &&
                expressHasFios &&
                (expressInternet === 'two_gig' || expressInternet === 'one_gig')
                    ? { discount: 10 }
                    : (line.name === 'Unlimited Plus' ||
                          line.name === 'Unlimited Ultimate') &&
                      expressHasFios &&
                      expressInternet !== 'two_gig' &&
                      expressInternet !== 'one_gig'
                    ? { discount: 5 }
                    : line.name === 'Unlimited Welcome' && expressHasFios
                    ? { discount: 5 }
                    : { discount: 0 }
            )
            .reduce((acc, line) => acc + line.discount, 0)
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
    const perksTotal = (): number => {
        return lines
            .map((line) =>
                line.perks.map((perk) => (perk.selected ? perk.price : 0))
            )
            .flat()
            .reduce((acc, perks) => acc + perks, 0)
    }

    const autoPayDiscount = (): number => {
        return expressAutoPay === 10 ? lines.length * 10 : 0
    }

    const resetAll = () => {
        dispatch(setLinesData([]))
        dispatch(setExpressAutoPay(0))
        dispatch(setExpressFirstResponder(false))
        dispatch(setExpressHasFios(false))
        dispatch(setExpressInternet())
        if (isWelcome) dispatch(toggleIsWelcomeQualified())
    }

    const loyaltyBonusDiscount = (): number => {
        return 0
        return lines
            .map((line) =>
                (line.name === 'Unlimited Welcome' ||
                    line.name === 'Unlimited Plus' ||
                    line.name === 'Unlimited Ultimate') &&
                expressInternet !== 'two_gig' &&
                expressInternet !== 'one_gig' &&
                expressHasFios
                    ? {
                          discount:
                              lines.length === 1
                                  ? 30
                                  : lines.length === 2
                                  ? 20
                                  : lines.length === 3
                                  ? 5
                                  : 0
                      }
                    : (line.name === 'Unlimited Plus' ||
                          line.name === 'Unlimited Ultimate') &&
                      (expressInternet === 'two_gig' ||
                          expressInternet === 'one_gig') &&
                      expressHasFios
                    ? {
                          discount:
                              lines.length === 1
                                  ? 25
                                  : lines.length === 2
                                  ? 15
                                  : 0
                      }
                    : line.name === 'Unlimited Welcome' &&
                      expressHasFios &&
                      (expressInternet === 'one_gig' ||
                          expressInternet === 'two_gig')
                    ? {
                          discount:
                              lines.length === 1
                                  ? 30
                                  : lines.length === 2
                                  ? 20
                                  : lines.length === 3
                                  ? 5
                                  : 0
                      }
                    : { discount: 0 }
            )
            .reduce((acc, line) => acc + line.discount, 0)
    }
    return (
        <View>
            <Row
                style={{
                    justifyContent: showResetAll ? 'space-between' : 'center',
                    paddingHorizontal: SIZES.padding,
                    width: '100%',
                    gap: SIZES.padding * 2
                }}
            >
                {showResetAll && (
                    <Text center fontFamily="SFLight" fontSize={12}>
                        Note: ${lines.length * 35} activation fee will be
                        included in the first bill
                    </Text>
                )}
            </Row>
            <TouchableOpacity
                style={{
                    width: '100%',
                    alignSelf: 'center',
                    marginVertical: SIZES.base
                }}
                onPress={onClickSave}
            >
                <Text center={true} fontFamily="SFHeavy" color="accent">
                    {showResetAll ? 'View Summary' : 'Save Wireless Quote'}
                </Text>
            </TouchableOpacity>
            {/* <Row style={{ alignSelf: 'center', gap: 8 }}>
                <Text color="tertiary" fontFamily={'SFRegular'}>
                    Welcome Offer (NY & MA)
                </Text>
                <Switch
                    value={isWelcome}
                    trackColor={{ false: thumbColor, true: '#8d99ae' }}
                    thumbColor={isWelcome ? thumbColor : 'grey'}
                    ios_backgroundColor={bgColor}
                    onChange={() => {
                        dispatch(toggleIsWelcomeQualified())
                    }}
                    //onChange={() => dispatch(toggleIsWelcomeQualified())}
                />
            </Row> */}
            <Divider />
            <RowView show={lines.length > 0}>
                <Text fontFamily="SFBold" fontSize={16}>
                    Sub-Total
                </Text>
                <Text fontFamily="SFBold" fontSize={16}>
                    $
                    {(
                        lines.reduce((acc, line) => acc + line.price, 0) +
                        mobilePlusHomeDiscount() +
                        autoPayDiscount() +
                        loyaltyBonusDiscount() +
                        byod +
                        tradeInTotal()
                    ).toFixed(2)}
                </Text>
            </RowView>
            <RowView show={perksTotal() > 0}>
                <Text>Perks ({totalPerksCount(lines)})</Text>
                <Text fontFamily="SFLight" color="grey" fontSize={13}>
                    savings $({perksSavings().toFixed(2)})
                </Text>
                <Text>${perksTotal()}</Text>
            </RowView>
            <RowView show={autoPayDiscount() > 0}>
                <Text>Auto Pay Discount</Text>
                <Text color="red">-${autoPayDiscount()}</Text>
            </RowView>
            <RowView show={mobilePlusHomeDiscount() > 0}>
                <Text>M + H Discount</Text>
                <Text color="red">-${mobilePlusHomeDiscount()}</Text>
            </RowView>
            <RowView
                show={
                    loyaltyBonusDiscount() > 0 &&
                    moment().isAfter(LOYALTY_EXPIRATION_DATE)
                }
            >
                <Text>Loyalty Discount</Text>
                <Text fontSize={14} color="error">
                    ends ({LOYALTY_EXPIRATION_DATE})
                </Text>
                <Text color="red">-${loyaltyBonusDiscount()}</Text>
            </RowView>
            <RowView show={firstResponder() > 0}>
                <Text>First Responder</Text>
                <Text color="red">-${firstResponder()}</Text>
            </RowView>
            <RowView show={byod > 0}>
                <Text>BYOD Savings</Text>
                <Text fontFamily="SFLight" color="grey" fontSize={13}>
                    (36 months)
                </Text>
                <Text color="red">-${byod}</Text>
            </RowView>
            <RowView
                show={
                    welcomeTotal > 0 &&
                    isWelcome &&
                    lines.length <= 3 &&
                    welcomeOfferBonus() > 0
                }
            >
                <Text>LGPO</Text>
                <Text fontFamily="SFLight" color="warning" fontSize={13}>
                    exprires ({WELCOME_OFFER_EXPIRATION_DATE})
                </Text>
                <Text color="red">-${welcomeOfferBonus()}</Text>
            </RowView>
            <TouchableOpacity
                onPress={() => setShowTradeInDetails((prev) => !prev)}
            >
                <RowView show={tradeInTotal() > 0}>
                    <Row style={{ alignItems: 'center', gap: SIZES.base }}>
                        <Text>Trade-In Balance</Text>
                        <FontAwesome
                            size={16}
                            color={iconColor + '80'}
                            name={
                                showTradeInDetails
                                    ? 'chevron-right'
                                    : 'chevron-down'
                            }
                        />
                    </Row>

                    <Text color="text">${tradeInTotal().toFixed(2)}</Text>
                </RowView>
            </TouchableOpacity>
            <RowView show={showTradeInDetails}>
                <View style={{ padding: SIZES.padding, gap: 3, width: '100%' }}>
                    {lines
                        .filter((l) => l.tradeIn)
                        .map((t, index) => (
                            <Row
                                key={index}
                                style={{ justifyContent: 'space-between' }}
                            >
                                <Text fontFamily="QSLight">
                                    {index + 1} - {t.name}
                                </Text>

                                <Text fontFamily="QSLight">
                                    ${t.tradeInValues?.monthlyPrice.toFixed(2)}
                                </Text>
                            </Row>
                        ))}
                </View>
            </RowView>

            <RowView show={lines.length > 0}>
                <Text fontFamily="SFHeavy" fontSize={20}>
                    Total
                </Text>
                <Text color="grey">
                    {autoPayDiscount() === 0 ? 'w/o' : 'w/'} auto pay
                </Text>
                <Text fontFamily="SFHeavy" fontSize={20}>
                    ${total().toFixed(2)}
                </Text>
            </RowView>
            <Divider small />

            {showResetAll && (
                <Row
                    style={{
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: SIZES.padding * 2
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                router.push('/(app)/(modals)/quotes')
                            }
                        >
                            <Text fontFamily="SFBold" color="grey">
                                View Saved Quotes
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={resetAll}
                        style={{
                            // position: "absolute",

                            alignSelf: 'center',
                            marginTop: 30
                        }}
                    >
                        <Text fontFamily="SFBold" center color="warning">
                            RESET ALL
                        </Text>
                    </TouchableOpacity>
                </Row>
            )}
        </View>
    )
}

export default TotalView

type PropsView = { children?: React.ReactNode; show: boolean }
const RowView = ({ children, show }: PropsView) => {
    return (
        <AnimatePresence>
            {show && (
                <MotiView
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: SIZES.base
                    }}
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -20 }}
                    transition={{ type: 'timing', duration: 300 }}
                >
                    {children}
                </MotiView>
            )}
        </AnimatePresence>
    )
}
