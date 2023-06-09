import { memo } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { BookingColorType, CalendarVM, DayType } from "../../core";

import {
  getNextDay,
  getPreviousDay,
  periodHasCompleted,
  periodHasNotEnDate,
  periodHasNotStartDate,
} from "./helper";

import {
  getCurrentDayColor,
  styleSelector,
  style as calendarStyle,
} from "./style";
import { CurrentDayPointer } from "./CurrentDayPointer";
import { CheckIn, CheckOut, CheckInCheckOut } from "./PeriodDelimiter";
import { RangeType } from "./types";
import { onPressHandler } from "./helpers/onPressHelper";

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
  setNextDay: (day: DayType) => void;
};

type CheckMarkerType = {
  day: DayType;
  days: DayType[];
  index: number;
  editMode?: boolean;
  bookingColors?: BookingColorType;
  periodColor?: boolean;
};

export const CheckMarker = memo(
  ({
    day,
    days,
    index,
    editMode,
    bookingColors,
    periodColor,
  }: CheckMarkerType) => {
    if (periodHasNotEnDate(day)) {
      return (
        <CheckIn
          day={day}
          editMode={editMode}
          bookingColors={bookingColors}
          periodColor={periodColor}
        />
      );
    }

    if (periodHasNotStartDate(day)) {
      return (
        <CheckOut
          day={day}
          editMode={editMode}
          bookingColors={bookingColors}
          periodColor={periodColor}
        />
      );
    }

    if (periodHasCompleted(day)) {
      return (
        <CheckInCheckOut
          yesterday={getPreviousDay(days, index)}
          tomorrow={getNextDay(days, index)}
          editMode={editMode}
          bookingColors={bookingColors}
          periodColor={periodColor}
        />
      );
    }

    return null;
  }
);

export const Days = ({
  bookingDayHandler,
  days,
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
}: DayComponentType & { daysSelected: DayType[] }) => {
  const renderDays = days.map((day, idx) => {
    const isBookingOption =
      day.bookingType === "option" && !day.isStartDate && !day.isEndDate;

    const nextDay = days[idx + 1];

    const condition = !day.isSelectedDate || daysSelected.length === 2;

    return (
      <Pressable
        onPress={() => {
          if (!day.isPastDay && Object.keys(day).length !== 0 && condition) {
            setNextDay(nextDay);
            onPressHandler({
              bookingDayHandler,
              days,
              setPeriod,
              withInteraction,
              hasCompletedRange,
              rangeMarkerHandler,
              resetCalendar,
              calendar,
              bookingColors,
              day,
              periodIsValid,
              setPeriodIsValid,
              setDaysSelected,
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
            ...(getCurrentDayColor(day) as {}),
            zIndex: 3,
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
