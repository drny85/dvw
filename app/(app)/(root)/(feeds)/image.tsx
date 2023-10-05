import { ImageBackground, StatusBar, TouchableOpacity } from "react-native";
import React from "react";
import Header from "@/common/components/Header";
import { useRouter } from "expo-router";
import { SIZES } from "@/constants/Sizes";
import View from "@/common/components/View";
import Text from "@/common/components/Text";
import useAppSelector from "@/common/hooks/useAppSelector";
import { Ionicons } from "@expo/vector-icons";
import useThemeColor from "@/common/hooks/useThemeColor";

const FullImage = () => {
  const router = useRouter();
  const { message, image } = useAppSelector((s) => s.feeds.postInfo);
  const [scale, setScale] = React.useState(1);
  const bgColor = useThemeColor("accent");
  const bg = useThemeColor("background");

  const photos: { key: string; value: string }[] = [
    { key: "photo1", value: require("@/assets/images/feeds/1.jpg") },
    { key: "photo2", value: require("@/assets/images/feeds/2.jpg") },
    { key: "photo3", value: require("@/assets/images/feeds/3.jpg") },
    { key: "photo4", value: require("@/assets/images/feeds/4.jpg") },
    { key: "photo5", value: require("@/assets/images/feeds/5.jpg") },
    { key: "photo6", value: require("@/assets/images/feeds/6.jpg") },
    { key: "photo7", value: require("@/assets/images/feeds/7.jpg") },
    { key: "photo8", value: require("@/assets/images/feeds/8.jpg") },
    { key: "photo9", value: require("@/assets/images/feeds/9.jpg") },
    // Add more key-value pairs as needed
  ];

  // Generate a random index to select a random photo

  // Get the selected photo object
  const selectedPhoto = photos[+image];
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={"light-content"} />
      <ImageBackground
        source={selectedPhoto.value as any}
        style={{ width: "100%", height: "100%", transform: [{ scale }] }}
        resizeMode="cover"
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
        <Header
          white
          contentContainerStyle={{ marginTop: SIZES.statusBarHeight }}
          onPressBack={router.back}
          title="Post Image"
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: SIZES.padding,
          }}
        >
          <Text
            center
            color="white"
            fontFamily="QSBold"
            fontSize={SIZES.width > 500 ? 30 : 24}
          >
            {message}
          </Text>
        </View>
      </ImageBackground>
      <View
        style={{
          position: "absolute",
          bottom: 40,
          gap: SIZES.padding,
          right: 10,
          padding: SIZES.base,
          borderRadius: SIZES.radius * 3,
          borderWidth: 1,
          borderColor: "white",
          backgroundColor: bgColor,
        }}
      >
        <TouchableOpacity
          onPress={() => setScale((prev) => (prev < 1.5 ? prev + 0.1 : 1))}
        >
          <Ionicons name="add" size={30} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="close" size={30} onPress={() => setScale(1)} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScale((prev) => (prev > 0.5 ? prev - 0.1 : 1))}
        >
          <Ionicons name="remove" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FullImage;
