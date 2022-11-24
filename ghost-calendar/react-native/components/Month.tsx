import { memo } from "react";
import { View, Text } from "react-native";
import { DayType, MonthType } from "../../core";

import { Days } from "./Days";
import { EditModeDays } from "./EditModeDays";

export const Month = memo(
  ({
    month,
    editMode,
    bookingDayHandler,
    setPeriod,
    withInteraction,
  }: {
    month: MonthType;
    editMode: boolean;
    bookingDayHandler?: (day: DayType) => void;
    setPeriod: (day: DayType) => void;
    withInteraction: boolean;
  }) => (
    <>
      <View style={{ marginBottom: 10, marginTop: 20, paddingLeft: 19 }}>
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
    </>
  )
);
