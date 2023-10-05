import React from "react";
import Screen from "@/common/components/Screen";
import Header from "@/common/components/Header";
import WebView, { WebViewNavigation } from "react-native-webview";
import { router } from "expo-router";
import { Alert } from "react-native";

const donate = () => {
  const uri = "https://donate.stripe.com/bIYg1CboecIe5Tq7ss";

  const handleChages = (event: WebViewNavigation) => {
    const { url } = event;

    const paid = url.includes("pay");
    if (paid) {
      Alert.alert("Thank you for your donation!");
      router.back();
    }
  };
  return (
    <Screen>
      <Header onPressBack={router.back} title="Donate" />
      <WebView
        onNavigationStateChange={handleChages}
        source={{ uri }}
        style={{ flex: 1 }}
      />
    </Screen>
  );
};

export default donate;
