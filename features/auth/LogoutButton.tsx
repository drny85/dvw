import useAppDispatch from "@/common/hooks/useAppDispatch";
import { Button } from "react-native";
import { logoutUser } from "./authActions";

/* Render a button that triggers a login action when pressed */

export default () => {
  const dispatch = useAppDispatch();
  return (
    <Button
      title="Logout"
      onPress={() => {
        dispatch(logoutUser());
      }}
    />
  );
};
