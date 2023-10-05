import { Comment } from "@/types";
import { AnimatePresence, MotiView } from "moti";
import React from "react";
import RepliesView from "./RepliesView";

type Props = {
  replies: Comment[];
  visible: boolean;
};
const RepliesContainer = ({ replies, visible }: Props) => {
  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          style={{ marginTop: 10, gap: 20 }}
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          transition={{ type: "timing", duration: 300 }}
        >
          {replies.map((comment, index) => (
            <RepliesView
              comment={comment}
              showNoReply
              key={comment.id + index}
              onLikeComment={() => {}}
              onReplyPress={() => {}}
            />
          ))}
        </MotiView>
      )}
    </AnimatePresence>
  );
};

export default RepliesContainer;
