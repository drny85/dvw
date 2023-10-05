import { useFeed } from "@/common/hooks/feeds/useFeed";
import useAppDispatch from "@/common/hooks/useAppDispatch";
import useAppSelector from "@/common/hooks/useAppSelector";
import useThemeColor from "@/common/hooks/useThemeColor";
import { SIZES } from "@/constants/Sizes";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { AnimatePresence, MotiView } from "moti";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Loading from "../Loading";
import Text from "../Text";
import View from "../View";
import CommentView from "./CommentView";
import { Comment } from "@/types";
import {
  addComment,
  deleteComment,
  updateComment,
} from "@/features/comments/commentActions";
import { useComments } from "@/common/hooks/comments/useComments";

type Props = {
  feedId: string;
  shouldFocus: boolean;
};

const FeedBottomSheet = forwardRef(
  ({ feedId, shouldFocus }: Props, ref: any) => {
    const snapPoints = useMemo(() => ["1%", "25%", "50%", "85%"], []);
    const { loading, feed } = useFeed(feedId);
    const { loading: loadingComments, comments } = useComments(feedId);
    const bgColor = useThemeColor("background");
    const user = useAppSelector((s) => s.auth.user);
    const textColor = useThemeColor("text");
    const placeHolderColor = useThemeColor("placeholder");
    const handleSheetChanges = useCallback((index: number) => {}, []);
    const [comment, setComment] = React.useState("");
    const [replying, setReplying] = React.useState<{
      name: string;
      commentId: string;
    } | null>(null);
    const dispatch = useAppDispatch();
    const inputRef = React.useRef<TextInput>(null);

    const handleDelete = async (id: string) => {
      try {
        dispatch(deleteComment({ commentId: id, feedId }));
      } catch (error) {
        console.log("Error deleting comment", error);
      }
    };

    const onPressCommentSend = () => {
      if (comment.length < 2) {
        Alert.alert("Comment must be at least 2 characters long");
        return;
      }

      const newComment: Comment = {
        content: comment,
        createdAt: new Date().toISOString(),
        id: new Date().toISOString(),
        user: user!,
        likes: [],
        replies: [],
      };
      //console.log("newComment", newComment);

      dispatch(addComment({ comment: newComment, feedId: feedId }));
      setComment("");
    };

    const onPressReplySend = () => {
      if (replying) {
        const newComment: Comment = {
          content: comment,
          createdAt: new Date().toISOString(),
          id: new Date().toISOString(),
          user: user!,
          likes: [],
          replies: [],
        };
        //console.log("newComment", newComment);

        const commentsCopy = [...comments];
        const commentIndex = commentsCopy.findIndex(
          (c) => c.id === replying.commentId
        );
        if (commentIndex === -1) {
          return;
        }
        const commentCopy = { ...commentsCopy![commentIndex] };

        commentCopy.replies = [...commentCopy?.replies!, newComment];
        commentsCopy[commentIndex] = commentCopy;

        try {
          dispatch(updateComment({ comment: commentCopy, feedId: feedId }));
        } catch (error) {
          console.log("Error updating feed", error);
        }
      }
      setReplying(null);
      setComment("");
    };

    const onLikeCommentPress = async (commentId: string) => {
      const commentsCopy = [...comments];
      const commentIndex = commentsCopy.findIndex((c) => c.id === commentId);
      const commentCopy = { ...commentsCopy![commentIndex] };

      if (commentCopy.likes.includes(user?.id!)) {
        commentCopy.likes = commentCopy.likes!.filter((id) => id !== user?.id!);
        commentsCopy[commentIndex] = commentCopy;
      } else {
        commentCopy.likes = [...commentCopy.likes!, user?.id!];
        commentsCopy[commentIndex] = commentCopy;
      }
      try {
        dispatch(updateComment({ comment: commentCopy, feedId: feedId }));
      } catch (error) {
        console.log("Error updating feed", error);
      }
    };

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={0}
          appearsOnIndex={3}
        />
      ),
      []
    );

    if (loading || loadingComments) return <Loading />;

    if (!feed) {
      return null;
    }

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        keyboardBehavior="fillParent"
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{
          backgroundColor: textColor,
        }}
        backgroundStyle={{
          backgroundColor: bgColor,
        }}
        enablePanDownToClose
      >
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text center fontFamily="SFBold">
            Comments
          </Text>
          <View style={{ marginTop: SIZES.padding, gap: SIZES.padding * 1.5 }}>
            {comments.map((comment, index) => (
              <CommentView
                comment={comment}
                key={comment.id + index}
                onLikeComment={() => {
                  onLikeCommentPress(comment.id);
                }}
                onDelete={() => handleDelete(comment.id)}
                onReplyPress={(data) => {
                  //console.log("onReplyPress", data.user.name);
                  inputRef.current?.focus();
                  setReplying({ name: data.user.name, commentId: data.id });
                }}
              />
            ))}
          </View>
        </BottomSheetScrollView>
        <AnimatePresence>
          {replying && (
            <MotiView
              style={{
                paddingHorizontal: SIZES.padding,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              from={{
                opacity: 0,
                translateY: 30,
              }}
              animate={{
                translateY: 0,
                opacity: 1,
              }}
              transition={{
                type: "timing",
              }}
              exit={{
                opacity: 0,
                translateY: 30,
              }}
            >
              <Text>Replying to @{replying.name}</Text>
              <TouchableOpacity onPress={() => setReplying(null)}>
                <FontAwesome name="close" size={20} color={"grey"} />
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>
        <View style={styles.inputContainer}>
          <BottomSheetTextInput
            ref={inputRef as any}
            autoFocus={shouldFocus}
            style={[styles.input, { color: textColor }]}
            placeholder="Type your comment"
            placeholderTextColor={placeHolderColor}
            onChangeText={setComment}
            value={comment}
          />
          {comment.length > 0 && (
            <TouchableOpacity
              onPress={replying ? onPressReplySend : onPressCommentSend}
              style={{ marginLeft: SIZES.base }}
            >
              <MaterialCommunityIcons name="send" size={32} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </BottomSheet>
    );
  }
);

export default FeedBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#efefef",
    zIndex: 20,
  },
  contentContainer: {
    //flex: 1,
    //alignItems: "center",
    marginBottom: SIZES.padding * 2,
    padding: SIZES.base,
    marginTop: SIZES.padding,
  },
  input: {
    marginTop: SIZES.base,
    marginBottom: 10,
    borderRadius: 10,
    height: 50,
    //width: "96%",
    flexGrow: 1,
    alignSelf: "center",

    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
});
