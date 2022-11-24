import { memo } from "react";
import { View, Text } from "react-native";
import { DayType, MonthType } from "../../core";

import { Days } from "./Days";
import { EditModeDays } from "./EditModeDays";

export const Month = memo(
  ({
    month,
    index,
    editMode,
    bookingDayHandler,
    setPeriod,
    withInteraction,
  }: {
    month: MonthType;
    index: number;
    editMode: boolean;
    bookingDayHandler?: (day: DayType) => void;
    setPeriod: (day: DayType) => void;
    withInteraction: boolean;
  }) => (
    <View key={`${month.id}${index}`}>
      <View style={{ marginBottom: 10, marginTop: 10, paddingLeft: 19 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            lineHeight: 24,
            color: "#202020",
          }}
        >
          {month.monthName}
        </Text>
      </View>
      {editMode ? (
        <EditModeDays
          bookingDayHandler={bookingDayHandler}
          days={month.days}
          setPeriod={setPeriod}
        />
      ) : (
        <Days
          bookingDayHandler={bookingDayHandler}
          days={month.days}
          setPeriod={setPeriod}
          withInteraction={withInteraction}
        />
      )}
    </View>
  )
);
