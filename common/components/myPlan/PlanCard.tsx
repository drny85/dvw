import { SIZES } from "@/constants/Sizes";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  image: ImageSourcePropType;
  onPress: () => void;
};
const PlanCard = ({ onPress, image }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container]}>
      <Image style={styles.image} resizeMode="stretch" source={image} />
    </TouchableOpacity>
  );
};

export default PlanCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius * 2,
    overflow: "hidden",
    width: "100%",
    height: SIZES.height * 0.5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: SIZES.radius,
    overflow: "hidden",
  },
});
