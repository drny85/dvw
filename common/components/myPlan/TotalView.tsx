import useAppDispatch from "@/common/hooks/useAppDispatch";
import useAppSelector from "@/common/hooks/useAppSelector";
import { SIZES } from "@/constants/Sizes";
import {
  setExpressAutoPay,
  setExpressFirstResponder,
  setExpressHasFios,
  setExpressInternet,
  setLinesData,
} from "@/features/wireless/wirelessSlide";
import { byodSavings } from "@/utils/byodSavings";
import { firstResponderDiscount } from "@/utils/firstResponderDiscount";
import { totalPerksCount } from "@/utils/perksCount";
import { AnimatePresence, MotiView } from "moti";
import React from "react";
import { TouchableOpacity } from "react-native";
import Divider from "../Divider";
import Row from "../Row";
import Text from "../Text";
import View from "../View";

type Props = {
  showResetAll?: boolean;
  onClickSave: () => void;
};
const TotalView = ({ onClickSave, showResetAll }: Props) => {
  const lines = useAppSelector((s) => s.wireless.lines);
  const dispatch = useAppDispatch();

  const {
    expressFirstResponder,
    expressAutoPay,
    expressHasFios,
    expressInternet,
  } = useAppSelector((s) => s.wireless);

  const byod = byodSavings(lines);
  const firstResponder = (): number =>
    firstResponderDiscount(lines.length, expressFirstResponder);

  const total = (): number =>
    lines.reduce((acc, line) => acc + line.price, 0) -
    firstResponderDiscount(lines.length, expressFirstResponder);

  const mobilePlusHomeDiscount = (): number => {
    return lines
      .map((line) =>
        (line.name === "Unlimited Plus" ||
          line.name === "Unlimited Ultimate") &&
        expressHasFios &&
        (expressInternet === "2gig" || expressInternet === "gig")
          ? { discount: 10 }
          : (line.name === "Unlimited Plus" ||
              line.name === "Unlimited Ultimate") &&
            expressHasFios &&
            expressInternet !== "2gig" &&
            expressInternet !== "gig"
          ? { discount: 5 }
          : line.name === "Unlimited Welcome" && expressHasFios
          ? { discount: 5 }
          : { discount: 0 }
      )
      .reduce((acc, line) => acc + line.discount, 0);
  };
  const perksSavings = (): number => {
    return lines
      .map((line) =>
        line.perks.map((perk) => (perk.selected ? perk.value - perk.price : 0))
      )
      .flat()
      .reduce((acc, perks) => acc + perks, 0);
  };
  const perksTotal = (): number => {
    return lines
      .map((line) => line.perks.map((perk) => (perk.selected ? perk.price : 0)))
      .flat()
      .reduce((acc, perks) => acc + perks, 0);
  };

  const autoPayDiscount = (): number => {
    return expressAutoPay === 10 ? lines.length * 10 : 0;
  };

  const resetAll = () => {
    dispatch(setLinesData([]));
    dispatch(setExpressAutoPay(0));
    dispatch(setExpressFirstResponder(false));
    dispatch(setExpressHasFios(false));
    dispatch(setExpressInternet());
  };

  const loyaltyBonusDiscount = (): number => {
    return lines
      .map((line) =>
        (line.name === "Unlimited Welcome" ||
          line.name === "Unlimited Plus" ||
          line.name === "Unlimited Ultimate") &&
        expressInternet !== "2gig" &&
        expressInternet !== "gig" &&
        expressHasFios
          ? {
              discount:
                lines.length === 1
                  ? 30
                  : lines.length === 2
                  ? 20
                  : lines.length === 3
                  ? 5
                  : 0,
            }
          : (line.name === "Unlimited Plus" ||
              line.name === "Unlimited Ultimate") &&
            (expressInternet === "2gig" || expressInternet === "gig") &&
            expressHasFios
          ? {
              discount: lines.length === 1 ? 25 : lines.length === 2 ? 15 : 0,
            }
          : line.name === "Unlimited Welcome" &&
            expressHasFios &&
            (expressInternet === "gig" || expressInternet === "2gig")
          ? {
              discount:
                lines.length === 1
                  ? 30
                  : lines.length === 2
                  ? 20
                  : lines.length === 3
                  ? 5
                  : 0,
            }
          : { discount: 0 }
      )
      .reduce((acc, line) => acc + line.discount, 0);
  };
  return (
    <View>
      <Row
        style={{
          justifyContent: showResetAll ? "space-between" : "center",
          paddingHorizontal: SIZES.padding,
          width: "100%",
          gap: SIZES.padding * 2,
        }}
      >
        {showResetAll && (
          <Text fontFamily="SFLight" fontSize={12}>
            Note: ${lines.length * 35} activation fee will be waived
          </Text>
        )}
        <TouchableOpacity
          style={{
            width: "100%",
          }}
          onPress={onClickSave}
        >
          <Text center={!showResetAll} fontFamily="SFHeavy" color="success">
            {showResetAll ? "Summary" : "Save Wireless Quote"}
          </Text>
        </TouchableOpacity>
      </Row>

      <Divider />
      <RowView show={lines.length > 0}>
        <Text fontFamily="SFBold" fontSize={18}>
          Sub-Total
        </Text>
        <Text fontFamily="SFBold" fontSize={18}>
          $
          {lines.reduce((acc, line) => acc + line.price, 0) +
            mobilePlusHomeDiscount() +
            autoPayDiscount() +
            loyaltyBonusDiscount() +
            byod}
        </Text>
      </RowView>
      <RowView show={perksTotal() > 0}>
        <Text>Perks ({totalPerksCount(lines)})</Text>
        <Text fontFamily="SFLight">savings $({perksSavings().toFixed(2)})</Text>
        <Text>${perksTotal()}</Text>
      </RowView>
      <RowView show={autoPayDiscount() > 0}>
        <Text>Auto Pay Discount</Text>
        <Text>-${autoPayDiscount()}</Text>
      </RowView>
      <RowView show={mobilePlusHomeDiscount() > 0}>
        <Text>M + H Discount</Text>
        <Text>-${mobilePlusHomeDiscount()}</Text>
      </RowView>
      <RowView show={loyaltyBonusDiscount() > 0}>
        <Text>Loyalty Discount</Text>
        <Text>-${loyaltyBonusDiscount()}</Text>
      </RowView>
      <RowView show={firstResponder() > 0}>
        <Text>First Responder</Text>
        <Text>-${firstResponder()}</Text>
      </RowView>
      <RowView show={byod > 0}>
        <Text>BYOD Savings</Text>
        <Text>-${byod}</Text>
      </RowView>
      <RowView show={lines.length > 0}>
        <Text fontFamily="SFHeavy" fontSize={22}>
          Total
        </Text>
        <Text fontFamily="SFHeavy" fontSize={22}>
          ${total().toFixed(0)}
        </Text>
      </RowView>
      {showResetAll && (
        <TouchableOpacity
          onPress={resetAll}
          style={{
            // position: "absolute",
            bottom: SIZES.padding,
            alignSelf: "center",
            marginTop: 30,
          }}
        >
          <Text fontFamily="SFBold" center color="warning">
            RESET ALL
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TotalView;

type PropsView = { children?: React.ReactNode; show: boolean };
const RowView = ({ children, show }: PropsView) => {
  return (
    <AnimatePresence>
      {show && (
        <MotiView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: SIZES.base,
          }}
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          transition={{ type: "timing", duration: 300 }}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
};
