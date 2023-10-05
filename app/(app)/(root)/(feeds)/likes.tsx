import { Image, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/Header";
import { router } from "expo-router";
import { SIZES } from "@/constants/Sizes";
import useAppSelector from "@/common/hooks/useAppSelector";
import { useUsers } from "@/common/hooks/auth/useUsers";
import Loading from "@/common/components/Loading";
import { AppUser } from "@/features/auth/authSlice";
import View from "@/common/components/View";
import Text from "@/common/components/Text";

const likes = () => {
  const feed = useAppSelector((s) => s.feeds.feed);

  if (!feed) return null;
  const { usersData, loading } = useUsers(feed?.likes);

  if (loading) return <Loading />;
  return (
    <Screen>
      <Header title="Likes" onPressBack={router.back} />
      <Text
        style={{
          fontSize: 18,
          marginLeft: SIZES.padding,
          marginTop: SIZES.base,
        }}
      >
        Liked By
      </Text>

      <ScrollView
        contentContainerStyle={{ padding: SIZES.padding }}
        showsVerticalScrollIndicator={false}
      >
        {usersData?.map((user) => (
          <UserLiked user={user} key={user.id} />
        ))}
      </ScrollView>
    </Screen>
  );
};

export default likes;

type Props = {
  user: AppUser;
};
const UserLiked = ({ user }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: SIZES.padding,
      }}
    >
      <Image
        resizeMode="cover"
        source={
          user.image
            ? { uri: user.image }
            : require("@/assets/images/profile.jpg")
        }
        style={{
          borderRadius: 40,
          marginRight: SIZES.padding,
          height: 80,
          width: 80,
        }}
      />
      <Text capitalize fontSize={18} fontFamily="SFBold">
        {user.name}
      </Text>
    </View>
  );
};
