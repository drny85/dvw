import React from "react";
import { ActivityIndicator, View } from "react-native";

import useThemeColor from "../hooks/useThemeColor";

import { ColorName } from "@/constants/Colors";

const Loading = (): JSX.Element => {
  const _color = useThemeColor("background");
  const c: ColorName = "text";
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: _color,
      }}
    >
      <ActivityIndicator color={c} size="large" />
    </View>
  );
};

export default Loading;
