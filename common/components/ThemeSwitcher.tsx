import React from "react";
import Row from "./Row";
import Text from "./Text";
import { Ionicon } from "./Icon";
import ThemeIcon from "@/features/settings/ThemeIcon";

type Props = {
  small?: boolean;
};
const ThemeSwitcher = ({ small }: Props) => {
  return (
    <Row
      backgroundColor={small ? "background" : "primary"}
      style={{
        padding: small ? 10 : 16,
        borderRadius: small ? 10 : 16,
        columnGap: 16,
        alignSelf: small ? "center" : undefined,
      }}
    >
      {!small && (
        <>
          <Ionicon size={32} name="contrast" />
          <Text fontSize={16} fontFamily="SFMedium" style={{ flex: 1 }}>
            Theme
          </Text>
        </>
      )}

      <Row style={{ columnGap: small ? 8 : undefined }}>
        <ThemeIcon name="sunny" theme="light" size={small ? 20 : 28} />
        <ThemeIcon name="contrast" theme="auto" />
        <ThemeIcon name="moon" theme="dark" />
      </Row>
    </Row>
  );
};

export default ThemeSwitcher;
