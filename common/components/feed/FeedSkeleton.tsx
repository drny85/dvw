import { StyleSheet } from "react-native";
import React from "react";
import { MotiView } from "moti";
import useThemeColor from "@/common/hooks/useThemeColor";
import { useDimensions } from "@/common/hooks/useDimensions";
import { SIZES } from "@/constants/Sizes";

const FeedSkeleton = () => {
  const bgGrey = useThemeColor("grey");
  const bg = useThemeColor("background");
  const { value } = useDimensions();

  return (
    <MotiView
      style={{
        width: "100%",
        height: value.height * 0.3,
        backgroundColor: bg,
        gap: SIZES.padding,
        borderRadius: SIZES.radius,
        overflow: "hidden",
      }}
    >
      <MotiView
        style={{ width: "100%", height: "65%", backgroundColor: bgGrey }}
        animate={{ opacity: [0.3, 0.4, 0.3] }}
        transition={{
          type: "timing",
          duration: 500,
          repeat: Infinity,
          delay: 500,
        }}
      />
      <MotiView
        style={{ width: "100%", height: "10%", backgroundColor: bgGrey }}
        animate={{ opacity: [0.2, 0.5, 0.3] }}
        transition={{
          type: "timing",
          duration: 500,
          repeat: Infinity,
          delay: 600,
        }}
      >
        <MotiView style={{ flexDirection: "row", gap: 18 }}>
          <MotiView
            animate={{ opacity: [0.2, 0.5, 0.3] }}
            transition={{
              type: "timing",
              duration: 500,
              repeat: Infinity,
              delay: 600,
            }}
          />
        </MotiView>
      </MotiView>
      <MotiView
        style={{ width: "100%", height: "25%", backgroundColor: bgGrey }}
        animate={{ opacity: [0.1, 0.7, 0.4] }}
        transition={{
          type: "timing",
          duration: 500,
          repeat: Infinity,
          delay: 900,
        }}
      />
    </MotiView>
  );
};

export default FeedSkeleton;

const styles = StyleSheet.create({});
