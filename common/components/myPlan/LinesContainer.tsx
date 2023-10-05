import { SIZES } from "@/constants/Sizes";
import { Line, LineName } from "@/types";
import React from "react";
import { StyleSheet } from "react-native";
import View from "../View";
import LineItem from "./LineItem";

type Props = {
  lines: Line[];
  onBYOD: (id: string) => void;
  onDelete: (id: string) => void;
  onSwitchLine: (id: string, name: LineName) => void;
  onPerksPress: (id: string) => void;
};
const LinesContainer = ({
  lines,
  onBYOD,
  onDelete,
  onSwitchLine,
  onPerksPress,
}: Props) => {
  return (
    <View style={styles.container}>
      {lines.map((line, index) => (
        <LineItem
          key={line.id}
          index={index}
          line={line}
          onBYOD={() => onBYOD(line.id)}
          onDelete={() => onDelete(line.id)}
          onPerksPress={(id) => onPerksPress(id)}
          onSwitchLine={(id, name) => onSwitchLine(id, name)}
        />
      ))}
    </View>
  );
};

export default LinesContainer;

const styles = StyleSheet.create({
  container: {
    padding: SIZES.base,
    gap: SIZES.padding,
  },
  lineName: {
    flexDirection: "row",
    gap: SIZES.base,
    alignItems: "center",
    justifyContent: "space-around",
  },
});
