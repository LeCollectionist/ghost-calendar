import { View, Text } from "react-native";
import { memo } from "react";
import { BookingColorType, CalendarVM, DayType, MonthType } from "../../core";

import { Days } from "./Days";
import { RangeType } from "./types";

type MonthComponentType = {
  month: MonthType;
  bookingDayHandler?: (day: DayType) => void;
  setPeriod: (day: DayType) => void;
  withInteraction: boolean;
  hasCompletedRange?: (hasCompletedRange: boolean) => void;
  rangeMarkerHandler?: (info: RangeType) => void;
  resetCalendar: () => void;
  calendar: CalendarVM;
  bookingColors: BookingColorType;
  periodIsValid?: (isValid: boolean) => void;
  setPeriodIsValid: (isValid: boolean) => void;
  setDaysSelected: (day: DayType[]) => void;
  setNextDay: (day: DayType) => void;
  daysSelected: DayType[];
};

export const Month = memo(
  ({
    month,
    bookingDayHandler,
    setPeriod,
    withInteraction,
    hasCompletedRange,
    rangeMarkerHandler,
    resetCalendar,
    calendar,
    bookingColors,
    periodIsValid,
    setPeriodIsValid,
    setDaysSelected,
    setNextDay,
    daysSelected,
  }: MonthComponentType) => (
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
        periodIsValid={periodIsValid}
        setPeriodIsValid={setPeriodIsValid}
        setDaysSelected={setDaysSelected}
        setNextDay={setNextDay}
        daysSelected={daysSelected}
      />
    </>
  )
);
