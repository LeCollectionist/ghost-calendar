import { View, Text, Pressable, Image } from "react-native";
import { BookingColorType, CalendarVM, DayType, PeriodRules } from "../../core";

import {
  getCurrentDayColor,
  styleSelector,
  style as calendarStyle,
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
};

export const Days = ({
  days,
  calendar,
  bookingColors,
  bookingDayHandler,
  periodIsValid,
  setNextDay,
  daysSelected,
  periodRules,
  defaultMinimumDuration,
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
      day.isInPeriod || day.startPeriod || day.endPeriod;

    const periodCondition = Boolean(periodIsValid) ? day.isInPeriod : true;

    const pressConditon =
      periodCondition &&
      !day.isPastDay &&
      Object.keys(day).length !== 0 &&
      condition;

    return (
      <Pressable
        onPress={() => {
          if (pressConditon) {
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
              ...otherProps,
            });
          }
        }}
        style={styleSelector(day, false, bookingColors, Boolean(periodIsValid))}
        key={`${day.day}${idx}`}
      >
        {day.isCurrentDay && <CurrentDayPointer />}
        <CheckMarker
          day={day}
          days={days}
          index={idx}
          bookingColors={bookingColors}
          periodColor={Boolean(periodIsValid)}
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
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      {renderDays}
    </View>
  );
};
