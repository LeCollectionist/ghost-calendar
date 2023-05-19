import { View, ActivityIndicator, FlatList } from "react-native";
import {
  BookingColorType,
  Calendar,
  CalendarPresenter,
  CalendarVM,
  DayType,
  LocaleType,
  Period,
  WorldTimezones,
} from "../../core";

import { useCalendar } from "../hooks/useCalendar";

import { RangeType } from "./types";
import { Month } from "./Month";
import { Week } from "./Week";
import { useEffect } from "react";

type CalendarComponentType = {
  bookingColors?: BookingColorType;
  bookingDayHandler?: (day: DayType) => void;
  editMode?: boolean;
  rangeMarkerHandler?: (info: RangeType) => void;
  withInteraction?: boolean;
  hasCompletedRange?: (hasCompletedRange: boolean) => void;
  newCalendar: {
    calendar: Calendar;
    presenter: CalendarPresenter;
  };
  locale: LocaleType;
};

const CalendarComponent = ({
  bookingDayHandler,
  editMode = false,
  rangeMarkerHandler,
  withInteraction = false,
  hasCompletedRange,
  newCalendar,
  locale,
}: CalendarComponentType) => {
  const { calendar, setPeriod, resetCalendar } = useCalendar({
    newCalendar,
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
              resetCalendar={resetCalendar}
              calendar={calendar}
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
