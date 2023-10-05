import Header from "@/common/components/Header";
import Screen from "@/common/components/Screen";
import PerkCard from "@/common/components/myPlan/PerkCard";
import useAppDispatch from "@/common/hooks/useAppDispatch";
import useAppSelector from "@/common/hooks/useAppSelector";
import { NON_PREMIUM_BYOD_VALUE, PREMIUM_BYOD_VALUE } from "@/constants";
import { SIZES } from "@/constants/Sizes";
import { setLinesData } from "@/features/wireless/wirelessSlide";
import { Line, Perk } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";

const perksView = () => {
  const { lineId } = useLocalSearchParams<{ lineId: string }>();
  const dispatch = useAppDispatch();
  const {
    expressAutoPay,
    lines,
    expressHasFios,
    expressFirstResponder,
    expressInternet,
  } = useAppSelector((state) => state.wireless);
  const line = lines.find((l) => l.id === lineId) as Line;
  const lineIndex = lines.findIndex((l) => l.id === lineId);

  const onTogglePerk = (perk: Perk) => {
    const newPerks = line.perks.map((p) => {
      if (p.name.toLowerCase() === perk.name.toLowerCase()) {
        return {
          ...p,
          selected: !p.selected,
        };
      }
      return p;
    });

    const newLines = lines.map((l) => {
      if (l.id === line.id) {
        return {
          ...l,
          price: calculatePrice({ ...l, perks: newPerks }),
          perks: newPerks,
        };
      }
      return l;
    });

    dispatch(setLinesData(newLines));
  };

  const mobilePlusHome = (line: Line): number => {
    if (
      (expressInternet === "gig" || expressInternet === "2gig") &&
      (line.name === "Unlimited Plus" || line.name === "Unlimited Ultimate")
    ) {
      return 10;
    } else if (
      expressHasFios &&
      expressInternet === "gig" &&
      line.name === "Unlimited Welcome"
    ) {
      return 5;
    } else if (expressHasFios && expressInternet !== "gig") {
      return 5;
    } else {
      return 0;
    }
  };
  const perksTotal = (line: Line): number => {
    return line.perks
      .map((i) => (i.selected ? i.price : 0))
      .reduce(
        (acc, p) => acc + p,

        0
      );
  };
  const calculateLoyaltyBonus = (
    line: Line,
    internet: typeof expressInternet
  ): number => {
    if (!expressHasFios || lines.length === 0) return 0;
    const gig = internet === "gig" || internet === "2gig";
    if (line.name === "Unlimited Plus" || line.name === "Unlimited Ultimate") {
      if (gig) {
        return lines.length === 1 ? 25 : lines.length === 2 ? 15 : 0;
      }
      return lines.length === 1
        ? 30
        : lines.length === 2
        ? 20
        : lines.length === 3
        ? 5
        : 0;
    } else if (line.name === "Unlimited Welcome") {
      return lines.length === 1
        ? 30
        : lines.length === 2
        ? 20
        : lines.length === 3
        ? 5
        : 0;
    } else {
      return 0;
    }
  };

  const calculatePrice = useCallback(
    (line: Line): number => {
      switch (line.name) {
        case "Unlimited Welcome":
          return (
            (lines.length === 1
              ? 75
              : lines.length === 2
              ? 65
              : lines.length === 3
              ? 50
              : lines.length === 4
              ? 40
              : lines.length >= 5
              ? 37
              : 0) -
            expressAutoPay -
            mobilePlusHome(line) -
            (line.byod ? NON_PREMIUM_BYOD_VALUE : 0) -
            calculateLoyaltyBonus(line, expressInternet) +
            perksTotal(line)
          );
        case "Unlimited Plus":
          return (
            (lines.length === 1
              ? 90
              : lines.length === 2
              ? 80
              : lines.length === 3
              ? 65
              : lines.length === 4
              ? 55
              : lines.length >= 5
              ? 52
              : 0) -
            expressAutoPay -
            mobilePlusHome(line) -
            (line.byod ? PREMIUM_BYOD_VALUE : 0) -
            calculateLoyaltyBonus(line, expressInternet) +
            perksTotal(line)
          );
        case "Unlimited Ultimate":
          return (
            (lines.length === 1
              ? 100
              : lines.length === 2
              ? 90
              : lines.length === 3
              ? 75
              : lines.length === 4
              ? 65
              : lines.length >= 5
              ? 62
              : 0) -
            expressAutoPay -
            mobilePlusHome(line) -
            (line.byod ? PREMIUM_BYOD_VALUE : 0) -
            calculateLoyaltyBonus(line, expressInternet) +
            perksTotal(line)
          );
        default:
          return 0;
      }
    },
    [
      lines.length,
      expressAutoPay,
      expressFirstResponder,
      expressInternet,
      expressHasFios,
    ]
  );

  if (!line) return;
  return (
    <Screen>
      <Header
        title={`Select Perks for Line ${lineIndex + 1}`}
        onPressBack={router.back}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: SIZES.base }}
      >
        <MotiView
          style={{ flexWrap: "wrap", flexDirection: "row", gap: SIZES.base }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {line.perks.map((p) => (
            <PerkCard key={p.name} perk={p} onPress={() => onTogglePerk(p)} />
          ))}
        </MotiView>
      </ScrollView>
    </Screen>
  );
};

export default perksView;

const styles = StyleSheet.create({});
