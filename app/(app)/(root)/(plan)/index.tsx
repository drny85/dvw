import { Button, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Screen from "@/common/components/Screen";
import Text from "@/common/components/Text";
import { router } from "expo-router";
import PlanCard from "@/common/components/myPlan/PlanCard";
import { SIZES } from "@/constants/Sizes";
import Header from "@/common/components/Header";
import View from "@/common/components/View";

const MyPlanHome = () => {
  return (
    <Screen>
      <View style={{ marginBottom: SIZES.base }}>
        <Header
          title="My Plan"
          hasRightIcon
          rightIcon={
            <TouchableOpacity
              onPress={() => router.push("/(app)/(root)/(plan)/myPlan")}
              style={{ marginRight: SIZES.padding }}
            >
              <Text color="text" fontFamily="SFHeavy" fontSize={18}>
                Get Started
              </Text>
            </TouchableOpacity>
          }
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: SIZES.padding,

          gap: SIZES.padding,
        }}
      >
        <PlanCard
          onPress={() => {
            router.push("/(app)/(root)/(plan)/details/ultimate");
          }}
          image={require("@/assets/images/ultimate.png")}
        />
        <PlanCard
          onPress={() => {
            router.push("/(app)/(root)/(plan)/details/plus");
          }}
          image={require("@/assets/images/plus.png")}
        />
        <PlanCard
          onPress={() => {
            router.push("/(app)/(root)/(plan)/details/welcome");
          }}
          image={require("@/assets/images/welcome.png")}
        />
        <Button
          title="Get Started"
          onPress={() => router.push("/(app)/(root)/(plan)/myPlan")}
        />
      </ScrollView>
    </Screen>
  );
};

export default MyPlanHome;

const styles = StyleSheet.create({});
