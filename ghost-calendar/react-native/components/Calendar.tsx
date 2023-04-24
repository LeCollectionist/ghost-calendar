import { useEffect } from "react";
import { View, ActivityIndicator, FlatList } from "react-native";
import {
  BookingColorType,
  DayType,
  LocaleType,
  Period,
  WorldTimezones,
} from "../../core";

import { useCalendar } from "../hooks/useCalendar";

import { RangeType } from "./types";
import { Month } from "./Month";
import { Week } from "./Week";

type CalendarComponentType = {
  bookingColors?: BookingColorType;
  bookingDayHandler?: (day: DayType) => void;
  checkIn?: Date;
  checkOut?: Date;
  editMode?: boolean;
  endDate: Date;
  locale?: LocaleType;
  rangeDates: Required<Period>[];
  rangeMarkerHandler?: (info: RangeType) => void;
  startDate: Date;
  visualMonth: number;
  withInteraction?: boolean;
  hasCompletedRange?: (hasCompletedRange: boolean) => void;
  timezone?: WorldTimezones;
};

const CalendarComponent = ({
  bookingColors = {},
  bookingDayHandler,
  checkIn,
  checkOut,
  editMode = false,
  endDate,
  locale,
  rangeDates,
  rangeMarkerHandler,
  startDate,
  visualMonth,
  withInteraction = false,
  hasCompletedRange,
  timezone,
}: CalendarComponentType) => {
  const { calendar, setPeriod, resetCalendar } = useCalendar({
    bookingColors,
    checkIn,
    checkOut,
    endDate,
    locale,
    rangeDates,
    startDate,
    visualMonth,
    timezone,
  });

  if (!calendar) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <Week locale={locale} />
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
        data={calendar.months}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item: month, index }) => (
          <View key={`${month.id}${index}`}>
            {index === 0 && <View style={{ marginTop: 20 }} />}
            <Month
              month={month}
              editMode={editMode}
              bookingDayHandler={bookingDayHandler}
              setPeriod={setPeriod}
              withInteraction={withInteraction}
              hasCompletedRange={hasCompletedRange}
              rangeMarkerHandler={rangeMarkerHandler}
              period={{
                startDate: calendar.checkIn,
                endDate: calendar.checkOut,
                resetCalendar,
              }}
            />
            {index === calendar.months.length - 1 && (
              <View style={{ marginBottom: 80 }} />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default CalendarComponent;
