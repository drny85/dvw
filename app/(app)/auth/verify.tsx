import React from "react";
import Screen from "@/common/components/Screen";
import Text from "@/common/components/Text";
import { TouchableOpacity } from "react-native";
import { SIZES } from "@/constants/Sizes";
import { router } from "expo-router";
import useThemeColor from "@/common/hooks/useThemeColor";

const EmailVerification = () => {
  const btnColor = useThemeColor("accent");
  return (
    <Screen
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: SIZES.padding * 3,
        padding: SIZES.padding,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold", lineHeight: 30 }}>
        Email was sent to your email address. Please check your inbox or junk
        folder and verify your email address.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: btnColor,
          paddingHorizontal: SIZES.padding * 4,
          paddingVertical: SIZES.padding,
          borderRadius: SIZES.radius * 3,
        }}
        onPress={() => router.replace("/(app)/auth")}
      >
        <Text fontFamily="SFHeavy" color="white" fontSize={20}>
          Login
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};

export default EmailVerification;
