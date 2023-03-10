import { memo, useMemo } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { DayType } from "../../core";
import * as Haptics from "expo-haptics";

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

export type DayComponentType = {
  bookingDayHandler?: (day: DayType) => void;
  days: DayType[];
  setPeriod: (day: DayType) => void;
  withInteraction: boolean;
  onSelectedDay?: (days: DayType[]) => void;
};

type CheckMarkerType = {
  day: DayType;
  days: DayType[];
  index: number;
  editMode?: boolean;
};

export const CheckMarker = memo(
  ({ day, days, index, editMode }: CheckMarkerType) => {
    if (periodHasNotEnDate(day)) {
      return <CheckIn day={day} editMode={editMode} />;
    }

    if (periodHasNotStartDate(day)) {
      return <CheckOut day={day} editMode={editMode} />;
    }

    if (periodHasCompleted(day)) {
      return (
        <CheckInCheckOut
          yesterday={getPreviousDay(days, index)}
          tomorrow={getNextDay(days, index)}
          editMode={editMode}
        />
      );
    }

    return null;
  }
);

export const Days = memo(
  ({
    bookingDayHandler,
    days,
    setPeriod,
    withInteraction,
    onSelectedDay,
  }: DayComponentType) => {
    const onPress = (day: DayType) => {
      const days: DayType[] = [];
      if (day.day) {
        if (onSelectedDay) {
          if (days.length < 2) days.push(day);
          if (days.length > 0) onSelectedDay(days);
        }
        if (day.isBooking && bookingDayHandler) bookingDayHandler(day);

        if (withInteraction) {
          setPeriod(day);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    };

    const renderDays = useMemo(
      () =>
        days.map((day, idx) => {
          const isBookingOption =
            day.bookingType === "option" && !day.isStartDate && !day.isEndDate;
          return (
            <Pressable
              onPress={() => onPress(day)}
              style={styleSelector(day)}
              key={`${day.day}${idx}`}
            >
              {day.isCurrentDay && <CurrentDayPointer />}
              <CheckMarker day={day} days={days} index={idx} />
              {isBookingOption && (
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
        }),
      [days]
    );

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
