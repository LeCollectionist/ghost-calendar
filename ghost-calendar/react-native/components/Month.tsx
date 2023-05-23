import { View, Text } from "react-native";
import { BookingColorType, CalendarVM, DayType, MonthType } from "../../core";

import { Days } from "./Days";
import { EditModeDays } from "./EditModeDays";
import { memo } from "react";
import { RangeType } from "./types";

export const Month = memo(
  ({
    month,
    editMode,
    bookingDayHandler,
    setPeriod,
    withInteraction,
    hasCompletedRange,
    rangeMarkerHandler,
    resetCalendar,
    calendar,
    bookingColors,
  }: {
    month: MonthType;
    editMode: boolean;
    bookingDayHandler?: (day: DayType) => void;
    setPeriod: (day: DayType) => void;
    withInteraction: boolean;
    hasCompletedRange?: (hasCompletedRange: boolean) => void;
    rangeMarkerHandler?: (info: RangeType) => void;
    resetCalendar: () => void;
    calendar: CalendarVM;
    bookingColors: BookingColorType;
  }) => (
    <>
      <View style={{ marginBottom: 10, marginTop: 0, paddingLeft: 19 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            lineHeight: 24,
            color: "#202020",
            textTransform: "capitalize",
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
          resetCalendar={resetCalendar}
          calendar={calendar}
          bookingColors={bookingColors}
        />
      ) : (
        <Days
          bookingDayHandler={bookingDayHandler}
          days={month.days}
          setPeriod={setPeriod}
          withInteraction={withInteraction}
          hasCompletedRange={hasCompletedRange}
          rangeMarkerHandler={rangeMarkerHandler}
          resetCalendar={resetCalendar}
          calendar={calendar}
          bookingColors={bookingColors}
        />
      )}
    </>
  )
);
