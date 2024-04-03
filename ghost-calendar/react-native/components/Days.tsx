import React, { memo } from "react";
import { View, Text, Image } from "react-native";
import { BookingColorType, CalendarVM, DayType, PeriodRules } from "../../core";

import { styleSelector, style as calendarStyle } from "./style";
import { CurrentDayPointer } from "./CurrentDayPointer";
import { RangeType } from "./types";
import { CheckMarker } from "./CheckMarker";

export type DayComponentType = {
  bookingDayHandler?: (day: DayType) => void;
  days: DayType[];
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
  defaultMinimumDuration?: number;
  absolute?: boolean;
};

export const Days = memo(
  ({
    days,
    bookingColors,
    periodIsValid,
    daysSelected,
  }: DayComponentType & {
    daysSelected: DayType[];
    periodRules?: PeriodRules[];
  }) => {
    const renderDays = days.map((day, idx) => {
      const isBookingOption =
        day.bookingType === "option" && !day.isStartDate && !day.isEndDate;

      return (
        <View
          style={styleSelector(
            day,
            false,
            bookingColors,
            Boolean(periodIsValid)
          )}
          key={`${day.day}${idx}`}
        >
          {day.isCurrentDay && <CurrentDayPointer />}
          <CheckMarker
            day={day}
            days={days}
            index={idx}
            bookingColors={bookingColors}
            periodColor={Boolean(periodIsValid)}
            daysSelected={daysSelected}
          />
          {isBookingOption && !Boolean(periodIsValid) && (
            <Image
              source={require("./optionFull.png")}
              style={calendarStyle.ach}
            />
          )}
          {day.isHalfDay && <Text style={{ zIndex: 3 }}>{day.dayNumber}</Text>}
        </View>
      );
    });

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {renderDays}
      </View>
    );
  }
);
