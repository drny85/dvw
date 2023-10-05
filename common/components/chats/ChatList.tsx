import useThemeColor from "@/common/hooks/useThemeColor";
import { Chat } from "@/types";
import { TouchableOpacity } from "react-native";
import Row from "../Row";
import { SIZES } from "@/constants/Sizes";
import View from "../View";
import Text from "../Text";
import { router } from "expo-router";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";
import SwipeableItem from "../Swipeable";

type Props = {
  setOpened: React.Dispatch<React.SetStateAction<string | null>>;
  item: Chat;
  rowRefs: Map<any, any>;
  onDelete: (id: string) => Promise<void>;
  iconColor: string;
};

const ChatList = ({ setOpened, item, rowRefs, onDelete, iconColor }: Props) => {
  const trashColor = useThemeColor("warning");
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/(root)/(chats)/${item.id}`)}
    >
      <Row
        style={{
          justifyContent: "space-between",
          padding: SIZES.padding,
        }}
      >
        <View style={{ width: "90%" }}>
          <Text fontFamily="SFBold" fontSize={20}>
            {item.name}
          </Text>
          <Row
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text fontSize={10} color="grey">
              created by:{" "}
              <Text color="grey" fontSize={12} capitalize>
                {item.user.name}
              </Text>
            </Text>
            <Text fontFamily="QSLight" fontSize={12} color="grey">
              {moment(item.createdAt).fromNow()}
            </Text>
          </Row>
        </View>
        <FontAwesome name="chevron-right" size={20} color={iconColor} />
      </Row>
    </TouchableOpacity>
  );
};

export default ChatList;
