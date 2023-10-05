// Import necessary modules and constants
import { ColorName } from "@/constants/Colors";
import { FontFamily } from "@/constants/Fonts";
import { Text as DefaultText, TextProps } from "react-native";
import useThemeColor from "../hooks/useThemeColor";
import { SIZES } from "@/constants/Sizes";

// Define props for the custom Text component
export type CustomTextProps = TextProps & {
  fontFamily?: FontFamily;
  color?: ColorName;
  fontSize?: number;
  capitalize?: boolean;
  uppercase?: boolean;
  center?: boolean;
};

// Define the custom Text component
export default function Text({
  style,
  fontFamily = "SFRegular",
  color = "text",
  fontSize = SIZES.font,
  ...props
}: CustomTextProps) {
  // Apply themed color based on the specified color name
  const _color = useThemeColor(color);

  // Render the custom Text component with customizable styles
  return (
    <DefaultText
      style={[
        {
          color: _color,
          fontFamily,
          fontSize,
          textTransform: props.capitalize
            ? "capitalize"
            : props.uppercase
            ? "uppercase"
            : undefined,
          textAlign: props.center ? "center" : undefined,
        },
        style,
      ]}
      {...props}
    />
  );
}
