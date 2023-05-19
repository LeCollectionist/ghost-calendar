import { memo } from "react";
import dayjs from "dayjs";
import { View, Text, Pressable, Image } from "react-native";
import { CalendarVM, DayType } from "../../core";
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
import { RangeType } from "./types";
import { getBookingDateUi } from "../../core/helpers/utils";

let daysT: string[] = [];
let daysD: string[] = [];

export type DayComponentType = {
  bookingDayHandler?: (day: DayType) => void;
  days: DayType[];
  setPeriod: (day: DayType) => void;
  withInteraction: boolean;
  hasCompletedRange?: (hasCompletedRange: boolean) => void;
  rangeMarkerHandler?: (info: RangeType) => void;
  resetCalendar: () => void;
  calendar: CalendarVM;
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

const ajouterElement = (nouvelElement: string): void => {
  if (daysT.length < 2) {
    daysT.push(nouvelElement);
  } else {
    daysT.splice(0, 2, nouvelElement);
  }
};

const ajouterElementD = (nouvelElement: string): void => {
  if (daysD.length < 2) {
    daysD.push(nouvelElement);
  } else {
    daysD.splice(0, 2, nouvelElement);
  }
};

let test = [];

export const Days = ({
  bookingDayHandler,
  days,
  setPeriod,
  withInteraction,
  hasCompletedRange,
  rangeMarkerHandler,
  resetCalendar,
  calendar,
}: DayComponentType) => {
  const onPress = (day: DayType, calendar: CalendarVM) => {
    if (hasCompletedRange && day.day) {
      ajouterElement(day.day);
      hasCompletedRange(daysT.length === 2);
    }
    if (day.isBooking && bookingDayHandler) bookingDayHandler(day);

    if (withInteraction) {
      setPeriod(day);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (
      rangeMarkerHandler &&
      day.day &&
      ((day.isBooking && (day.isStartDate || day.isEndDate)) || !day.isBooking)
    ) {
      ajouterElementD(day.day);
      test.push(day.day);

      if (dayjs(daysD[1]).diff(daysD[0]) < 0 && daysD.length === 2) {
        ajouterElementD(day.day);
      }

      if (getBookingDateUi(calendar, daysD[0], daysD[1]).length > 0) {
        ajouterElementD(day.day);
      }

      rangeMarkerHandler({
        startDate: daysD[0] || "",
        endDate: daysD[1] || "",
        resetCalendar: () => resetCalendar(),
      });
    }
  };

  const renderDays = days.map((day, idx) => {
    const isBookingOption =
      day.bookingType === "option" && !day.isStartDate && !day.isEndDate;
    return (
      <Pressable
        onPress={() => onPress(day, calendar)}
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
