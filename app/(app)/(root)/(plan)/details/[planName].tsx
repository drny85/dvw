import Header from "@/common/components/Header";
import Screen from "@/common/components/Screen";
import View from "@/common/components/View";
import { SIZES } from "@/constants/Sizes";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const PlanDetails = () => {
  const { planName } = useLocalSearchParams<{ planName: string }>();

  const uri =
    planName === "ultimate"
      ? "https://www.verizon.com/support/unlimited-ultimate-faqs/"
      : planName === "plus"
      ? "https://www.verizon.com/support/unlimited-plus-faqs/"
      : planName === "welcome"
      ? "https://www.verizon.com/support/welcome-unlimited-faqs/"
      : "https://www.verizon.com/shop/online/free-cell-phones/";

  return (
    <Screen>
      <View style={{ marginBottom: SIZES.base }}>
        <Header
          onPressBack={router.back}
          title={planName === "free" ? "Free Phones" : "Plan Details"}
        />
      </View>
      <WebView style={styles.container} source={{ uri: uri }} />
    </Screen>
  );
};

export default PlanDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
