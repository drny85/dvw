// Import necessary modules and constants
import { useState } from "react";
import { TextInput as Input, StyleSheet } from "react-native";
import Text, { CustomTextProps } from "./Text";
import { ColorName } from "@/constants/Colors";
import useThemeColor from "../hooks/useThemeColor";
import { SIZES } from "@/constants/Sizes";
import View from "./View";

// Define props for the custom TextInput component, including customizable text styling properties and backgroundColor option
type InputError = {
  error?: string;
  isMultiline?: boolean;
};
export type TextInputProps = Input["props"] &
  CustomTextProps &
  InputError & { backgroundColor?: ColorName };

// Define the custom TextInput component
export default function TextInput({
  backgroundColor,
  color = "text",
  fontFamily,
  fontSize = SIZES.font * 1.2,
  isMultiline,
  error,
  style,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) {
  const [key, setKey] = useState<ColorName>("border");
  const borderColor = useThemeColor(key);

  // Retrieve themed colors
  const _color = useThemeColor(color);
  const _backgroundColor = backgroundColor
    ? useThemeColor(backgroundColor)
    : "transparent";
  const placeholderColor = useThemeColor("placeholder");

  return (
    <>
      <Input
        {...props}
        onFocus={(e) => {
          setKey("text");
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          setKey("placeholder");
          onBlur && onBlur(e);
        }}
        multiline={isMultiline}
        placeholderTextColor={placeholderColor}
        style={[
          style,
          styles.input,
          {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor,
            borderRadius: isMultiline ? SIZES.radius : SIZES.radius * 3,
            fontFamily,
            fontSize,
            minHeight: isMultiline ? SIZES.padding * 6 : undefined,
            color: _color,
            padding: 8,
            backgroundColor: _backgroundColor,
          },
        ]}
      />
      {error && (
        <View
          style={{
            alignSelf: "flex-end",
            marginRight: SIZES.padding,
            paddingVertical: SIZES.padding * 0.2,
          }}
        >
          <Text color="error">{error}</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: SIZES.radius * 3,
    width: "100%",
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    fontSize: SIZES.font * 1.5,
  },
});
