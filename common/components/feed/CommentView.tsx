import { StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import View from "../View";
import Text from "../Text";
import { Comment } from "@/types";
import { SIZES } from "@/constants/Sizes";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";
import useAppSelector from "@/common/hooks/useAppSelector";
import RepliesContainer from "./RepliesContainer";

type Props = {
  comment: Comment;
  onLikeComment: () => void;
  onReplyPress?: (comment: Comment) => void;
  showNoReply?: boolean;

  onDelete?: () => void;
};
const CommentView = ({
  comment,
  onLikeComment,
  onReplyPress,
  showNoReply,

  onDelete,
}: Props) => {
  const user = useAppSelector((s) => s.auth.user);
  const isMe = user?.id === comment.user.id;

  const likedComment = comment.likes?.includes(user?.id!);
  const [showReplies, setShowReplies] = React.useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={
            comment.user.image
              ? { uri: comment.user.image }
              : require("@/assets/images/profile.jpg")
          }
          style={styles.image}
        />
        <View>
          <Text capitalize fontFamily="SFBold">
            {comment.user.name ||
              comment.user.email?.split(".")[0] +
                " " +
                comment.user.email?.split("@")[0].split(".")[1]}
            {"  "}
            <Text fontFamily="SFLight" fontSize={10} color="grey">
              {moment(comment.createdAt).fromNow()}
            </Text>
          </Text>

          <Text fontFamily="SFLight">{comment.content} 3</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: SIZES.base,
            }}
          >
            {comment.likes && comment.likes.length > 0 && (
              <Text>
                {comment.likes?.length}{" "}
                {comment.likes && comment.likes.length > 1 ? "likes" : "like"}
              </Text>
            )}
            {!isMe && !showNoReply && (
              <TouchableOpacity
                onPress={() => onReplyPress && onReplyPress(comment)}
              >
                <Text color="grey" fontFamily="SFBold">
                  reply
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {comment.replies && comment.replies.length > 0 && (
            <>
              <TouchableOpacity
                onPress={() => setShowReplies(!showReplies)}
                style={{ marginTop: SIZES.base, paddingLeft: SIZES.base }}
              >
                <Text fontFamily="SFLight" color="grey">
                  {showReplies ? "hide" : "view"} {comment.replies?.length}{" "}
                  {comment.replies && comment.replies.length > 1
                    ? "replies"
                    : "reply"}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <RepliesContainer replies={comment.replies!} visible={showReplies} />
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: SIZES.base,
        }}
      >
        <TouchableOpacity onPress={onLikeComment}>
          <FontAwesome
            name={likedComment ? "heart" : "heart-o"}
            size={18}
            color={likedComment ? "red" : "grey"}
            style={{ marginRight: SIZES.base }}
          />
        </TouchableOpacity>
        {isMe && (
          <TouchableOpacity onPress={onDelete}>
            <Text fontFamily="QSBold" color="warning">
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CommentView;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    gap: SIZES.padding,
    justifyContent: "space-between",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SIZES.base,
  },
});
