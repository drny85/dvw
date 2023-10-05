import React from "react";
import Screen from "@/common/components/Screen";
import Text from "@/common/components/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/common/components/Header";
import View from "@/common/components/View";
import { Button } from "react-native";

const FeedDetails = () => {
  const router = useRouter();
  const { feedId } = useLocalSearchParams<{ feedId: string }>();
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Header title="Feed Details" onPressBack={router.back} />
        <Text>FeedDetails {feedId}</Text>
        <Button onPress={() => console.log("clicked")} title="Click me" />
      </View>
    </Screen>
  );
};

export default FeedDetails;
