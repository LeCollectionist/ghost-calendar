import { View, Text } from "react-native";
import React, { memo } from "react";
import {
  BookingColorType,
  CalendarVM,
  DayType,
  MonthType,
  PeriodRules,
} from "../../core";

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
  setNextDay: (day: PeriodRules) => void;
  daysSelected: DayType[];
  periodRules?: PeriodRules[];
  defaultMinimumDuration?: number;
};

export const Month = memo(({ month, ...otherProps }: MonthComponentType) => (
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
    <Days days={month.days} {...otherProps} />
  </>
));
