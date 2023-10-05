import { SIZES } from "@/constants/Sizes";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import useAppSelector from "@/common/hooks/useAppSelector";
import useThemeColor from "@/common/hooks/useThemeColor";
import Styles from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import Text from "../Text";
import View from "../View";
import { MotiView } from "moti";
import { useDimensions } from "@/common/hooks/useDimensions";

type Props = {
  onAddLine: () => void;
  onRemoveLine: () => void;
  data?: number;
};
const LineSetter = ({ onRemoveLine, onAddLine, data }: Props) => {
  const bgColor = useThemeColor("secondary");
  const textColor = useThemeColor("white");
  const lines = useAppSelector((s) => s.wireless.lines);
  const { value } = useDimensions();

  return (
    <MotiView
      from={{ translateY: data ? 1 : 0 }}
      animate={{
        translateY: data ? 1 : lines.length > 0 ? 0 : value.height * 0.4,
        opacity: 1,
        zIndex: 200,
      }}
      transition={{ type: "timing", duration: 500 }}
    >
      <View
        style={[
          Styles.boxShadow,
          styles.container,
          { backgroundColor: bgColor },
        ]}
      >
        <TouchableOpacity onPress={onRemoveLine}>
          <Ionicons
            asButton
            name="remove"
            size={SIZES.width > 500 ? 50 : 40}
            color={textColor}
          />
        </TouchableOpacity>
        <Text color="white" fontFamily="SFHeavy" fontSize={24}>
          {data ? data : lines.length}
        </Text>
        <TouchableOpacity onPress={onAddLine}>
          <Ionicons
            name="add"
            size={SIZES.width > 500 ? 50 : 40}
            color={textColor}
          />
        </TouchableOpacity>
      </View>
    </MotiView>
  );
};

export default LineSetter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: SIZES.width > 500 ? SIZES.padding * 2 : SIZES.padding,
    borderRadius: SIZES.radius * 3,

    gap: SIZES.padding,

    alignSelf: "center",
  },
});
