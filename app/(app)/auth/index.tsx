import Loading from "@/common/components/Loading";
import Screen from "@/common/components/Screen";
import Text from "@/common/components/Text";
import TextInput from "@/common/components/TextInput";
import ThemeSwitcher from "@/common/components/ThemeSwitcher";
import View from "@/common/components/View";
import useAppDispatch from "@/common/hooks/useAppDispatch";
import useAppSelector from "@/common/hooks/useAppSelector";
import useThemeColor from "@/common/hooks/useThemeColor";
import { SIZES } from "@/constants/Sizes";
import Styles from "@/constants/Styles";
import { getUser } from "@/features/auth/authActions";
import { auth } from "@/firebase";

import { FIREBASE_ERRORS } from "@/utils/firebaseErrorMessages";
import { isEmailValid } from "@/utils/isEmailValid";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { reauthenticateWithCredential } from "firebase/auth/react-native";

import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

// Define the AuthScreen component, intended as a starting point for authentication
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useAppSelector((s) => s.auth.loading);
  const dispatch = useAppDispatch();
  const btnColor = useThemeColor("accent");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Please enter all fields");

        return;
      }
      if (!isEmailValid(email)) {
        Alert.alert("Email is not valid");

        return;
      }

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log(user.email);
      if (!user) return;
      dispatch(getUser({ userId: user.uid, isVerified: user.emailVerified }));
    } catch (error) {
      const err = error as Error;

      console.log("Error =>", err.message);
      Alert.alert("Error", FIREBASE_ERRORS[err.message] || err.message);
    }
  };

  if (loading) return <Loading />;
  return (
    <Screen style={Styles.flex}>
      <ThemeSwitcher small />
      <View style={styles.container}>
        <Text fontSize={24} fontFamily="SFHeavy">
          Welcome
        </Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmail}
          keyboardType="email-address"
          value={email}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: btnColor }]}
          onPress={handleLogin}
          disabled={!email || !password || loading}
        >
          <Text center fontSize={22} fontFamily="SFBold">
            Login
          </Text>
        </TouchableOpacity>
        <View style={styles.reset}>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text center fontSize={16} fontFamily="SFMedium">
              Create Account?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/auth/passwordReset")}>
            <Text color="warning" center fontSize={16} fontFamily="SFMedium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.padding,
    gap: SIZES.padding * 2,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    flex: 1,
  },
  btn: {
    borderRadius: SIZES.radius * 3,
    paddingHorizontal: SIZES.padding * 4,
    paddingVertical: SIZES.padding,
    justifyContent: "center",
    alignItems: "center",
  },
  reset: {
    position: "absolute",
    bottom: 30,

    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
});
