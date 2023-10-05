declare module "react-native-animate-number" {
  import { ComponentClass } from "react";
  import { ViewProps, StyleProp, ViewStyle } from "react-native";

  interface AnimateNumberProps {
    value: number;
    timing?: "linear" | "easeOut" | "easeIn" | "easeInOut";
    interval?: number;
    countBy?: number;
    steps?: number;
    formatter?: (value: number) => string;
    onProgress?: (value: number) => void;
    style?: StyleProp<ViewStyle>;
  }

  const AnimateNumber: ComponentClass<AnimateNumberProps & ViewProps>;

  export default AnimateNumber;
}
