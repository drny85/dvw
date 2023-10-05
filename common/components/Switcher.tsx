import React from "react";
import { Switch, StyleSheet } from "react-native";
import useThemeColor from "../hooks/useThemeColor";
import View from "./View";
import Text from "./Text";

interface SwitcherProps {
  title: string;
  value: boolean;
  onValueChange: () => void;
}

const Switcher: React.FC<SwitcherProps> = ({ title, value, onValueChange }) => {
  const trackColor = useThemeColor("accent");
  const thumbColor = useThemeColor("success");
  const bgColor = useThemeColor("background");

  return (
    <View style={styles.container}>
      <View style={{ width: "75%" }}>
        <Text capitalize style={styles.title}>
          {title}
        </Text>
      </View>
      <View>
        <Switch
          trackColor={{ false: thumbColor, true: trackColor }}
          thumbColor={value ? thumbColor : "grey"}
          ios_backgroundColor={bgColor}
          onChange={onValueChange}
          value={value}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 16,
  },
});

export default Switcher;
