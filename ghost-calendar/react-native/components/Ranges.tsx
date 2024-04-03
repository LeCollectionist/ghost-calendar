import React, { memo } from "react";
import { View, Pressable, Image, Text } from "react-native";
import { BookingColorType, CalendarVM, DayType, PeriodRules } from "../../core";

import {
  styleSelector,
  style as calendarStyle,
  getCurrentDayColor,
} from "./style";
import { CurrentDayPointer } from "./CurrentDayPointer";
import { RangeType } from "./types";
import { onPressHandler } from "./helpers/onPressHelper";
import { getNextPeriod } from "./helpers/getNextPeriod";
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

export const Ranges = memo(
  ({
    days,
    calendar,
    bookingColors,
    bookingDayHandler,
    periodIsValid,
    setNextDay,
    daysSelected,
    periodRules,
    defaultMinimumDuration,
    absolute,
    resetCalendar,
    ...otherProps
  }: DayComponentType & {
    daysSelected: DayType[];
    periodRules?: PeriodRules[];
  }) => {
    const renderDays = days.map((day, idx) => {
      const isBookingOption =
        day.bookingType === "option" && !day.isStartDate && !day.isEndDate;

      const condition = !day.isSelectedDate || daysSelected.length === 2;
      const fontWeightCondition =
        (day.isInPeriod || day.startPeriod || day.endPeriod) && !day.isPastDay;

      const periodCondition = Boolean(periodIsValid) ? day.isInPeriod : true;
      const hasBookingType =
        day.bookingType === "contract" && !(day.isStartDate || day.isEndDate)
          ? false
          : true;

      const periodValidCondition = periodIsValid
        ? Object.keys(day).length !== 0
        : Object.keys(day).length === 2;

      const pressConditon =
        periodCondition &&
        !day.isPastDay &&
        periodValidCondition &&
        condition &&
        hasBookingType;

      const bookingBetween =
        day.isBooking && !day.isStartDate && !day.isEndDate;

      return (
        <Pressable
          onPress={() => {
            if (bookingBetween && bookingDayHandler) {
              bookingDayHandler(day);
            }
            if (pressConditon || day.isStartDate || day.isEndDate) {
              if (periodIsValid) {
                const nextPeriod = getNextPeriod(
                  day.day as string,
                  periodRules,
                  defaultMinimumDuration
                );
                if (nextPeriod) setNextDay(nextPeriod);
              }
              onPressHandler({
                bookingDayHandler,
                days,
                calendar,
                bookingColors,
                day,
                periodIsValid,
                defaultMinimumDuration,
                resetCalendar,
                ...otherProps,
              });
            }
          }}
          style={{
            ...styleSelector(day, false, bookingColors, Boolean(periodIsValid)),
          }}
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
          <Text
            style={{
              ...(getCurrentDayColor(day, Boolean(periodIsValid)) as {}),
              zIndex: 3,
              fontWeight: fontWeightCondition ? "bold" : "normal",
            }}
          >
            {day.dayNumber}
          </Text>
        </Pressable>
      );
    });

    return (
      <View
        style={{
          position: "absolute",
          top: 35,
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
