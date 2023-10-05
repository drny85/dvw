import { Comment } from "@/types";
import { commentsCollection } from "@/lib/collactions";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useComments = (feedId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!feedId) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(commentsCollection(feedId), (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Comment))
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [feedId]);

  return { comments, loading };
};
