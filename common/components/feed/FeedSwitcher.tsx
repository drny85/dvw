import React from 'react'
import Row from '../Row'
import { SIZES } from '@/constants/Sizes'
import Text from '../Text'
import { StyleSheet, TouchableOpacity } from 'react-native'
import useAppSelector from '@/common/hooks/useAppSelector'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { setView } from '@/features/feeds/feedsSlide'

const FeedSwitcher = () => {
    const view = useAppSelector((s) => s.feeds.view)
    const dispatch = useAppDispatch()
    return (
        <Row
            style={{
                padding: SIZES.base,
                gap: SIZES.padding
            }}
        >
            <TouchableOpacity
                onPress={() => dispatch(setView('feeds'))}
                style={[
                    styles.container,
                    { borderBottomWidth: view === 'feeds' ? 2 : 0 }
                ]}
            >
                <Text fontFamily={view === 'feeds' ? 'SFBold' : 'SFRegular'}>
                    Feeds
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => dispatch(setView('posts'))}
                style={[
                    styles.container,
                    { borderBottomWidth: view === 'posts' ? 2 : 0 }
                ]}
            >
                <Text fontFamily={view === 'posts' ? 'SFBold' : 'SFRegular'}>
                    Posts
                </Text>
            </TouchableOpacity>
        </Row>
    )
}

export default FeedSwitcher

const styles = StyleSheet.create({
    container: {
        padding: SIZES.base,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
