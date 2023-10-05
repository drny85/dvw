import useAppDispatch from "@/common/hooks/useAppDispatch";
import useAppSelector from "@/common/hooks/useAppSelector";
import useThemeColor from "@/common/hooks/useThemeColor";
import { SIZES } from "@/constants/Sizes";
import { setFeed, setPostInfo } from "@/features/feeds/feedsSlide";
import { Feed } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "../Text";
import View from "../View";

type Props = {
  feed: Feed;
  onCommentPress: (shouldFocus: boolean) => void;
  onLikePress: (id: string) => void;
};
const ActionView = ({ feed, onCommentPress, onLikePress }: Props) => {
  const bgColor = useThemeColor("primary");
  const iconColor = useThemeColor("text");
  const heartColor = useThemeColor("error");
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const goToLikes = () => {
    dispatch(setFeed(feed));
    router.push("/(app)/(root)/(feeds)/likes");
  };

  if (!user) return null;
  const liked = feed.likes.includes(user?.id);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View
        style={{
          flexDirection: "row",
          gap: SIZES.padding,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => onLikePress(feed.id!)}>
          <MotiView
            from={{
              scale: 1,
            }}
            animate={{
              scale: liked ? [1, 1.5, 1] : 1,
            }}
            transition={{
              type: "timing",
              duration: 800,
            }}
          >
            <FontAwesome
              name={liked ? "heart" : "heart-o"}
              size={28}
              color={liked ? heartColor : iconColor}
            />
          </MotiView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onCommentPress(true)}>
          <FontAwesome name="commenting-o" size={30} color={iconColor} />
        </TouchableOpacity>
        {feed.likes.length > 0 && (
          <TouchableOpacity onPress={goToLikes}>
            <Text>
              {feed.likes.length} {feed.likes.length > 1 ? "likes" : "like"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          dispatch(setPostInfo({ message: feed.message, image: feed.image }));
          router.push("/(app)/(root)/(feeds)/image");
        }}
      >
        <Text fontFamily="SFBold">View Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionView;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: SIZES.base,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
