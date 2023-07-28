import { memo } from "react";
import { View } from "react-native";

export const Separator = memo(() => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "center",
        borderWidth: 0.8,
        borderColor: "#eaeaea",
      }}
    />
  );
});
