import React from "react";
import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "(chats)",
};

const ChatLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[chatId]"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="newChat" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default ChatLayout;
