import { Feed } from "@/types";
import { feedsColletion } from "@/lib/collactions";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFeeds = () => {
  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState<Feed[]>([]);

  useEffect(() => {
    const feedQuery = query(feedsColletion, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(feedQuery, (snapshot) => {
      setFeeds(
        snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Feed)
        ) as Feed[]
      );
      setLoading(false);
      console.log("useFeeds");
    });

    return unsubscribe;
  }, []);

  return { loading, feeds };
};
