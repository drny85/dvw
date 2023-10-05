import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SIZES } from "@/constants/Sizes";
import Switcher from "../Switcher";
import { Perk } from "@/types";

type Props = {
  perk: Perk;
  onPress: () => void;
};
const PerkCard = ({ perk, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Switcher
        title={perk.name}
        onValueChange={onPress}
        value={perk.selected}
      />
      <Image
        source={{ uri: perk.image }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

export default PerkCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius,
    height: SIZES.height * 0.2,
    width: "45%",
    overflow: "hidden",
    flexGrow: 1,
    maxWidth: "50%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius,
    overflow: "hidden",
    objectFit: "cover",
  },
});
