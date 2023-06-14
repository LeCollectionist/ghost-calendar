import { View, ActivityIndicator, FlatList } from "react-native";
import {
  BookingColorType,
  Calendar,
  CalendarPresenter,
  DayType,
  LocaleType,
  PeriodRules,
} from "../../core";

import { useCalendar } from "../hooks/useCalendar";

import { RangeType } from "./types";
import { Month } from "./Month";
import { Week } from "./Week";
import { useState } from "react";
import { PeriodInfo } from "./periodInfo";

type CalendarComponentType = {
  bookingColors?: BookingColorType;
  bookingDayHandler?: (day: DayType) => void;
  rangeMarkerHandler?: (info: RangeType) => void;
  withInteraction?: boolean;
  hasCompletedRange?: (hasCompletedRange: boolean) => void;
  newCalendar: {
    calendar: Calendar;
    presenter: CalendarPresenter;
  };
  locale: LocaleType;
  periodIsValid?: (isValid: boolean) => void;
  periodRules?: PeriodRules[];
  defaultMinimumDuration?: number;
};

const CalendarComponent = ({
  bookingDayHandler,
  rangeMarkerHandler,
  withInteraction = false,
  hasCompletedRange,
  newCalendar,
  locale,
  periodIsValid,
  periodRules,
  defaultMinimumDuration,
}: CalendarComponentType) => {
  const [isValid, setPeriodIsValid] = useState(true);
  const [daysSelected, setDaysSelected] = useState<DayType[]>([]);
  const [nextDay, setNextDay] = useState<PeriodRules | null>(null);
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
      {!isValid && periodIsValid && (
        <PeriodInfo
          locale={locale}
          daysSelected={daysSelected}
          nextDay={nextDay}
        />
      )}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 12 }}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
        data={calendar.months}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item: month, index }) => (
          <View key={`${month.id}${index}`}>
            {index === 0 && <View style={{ marginTop: 20 }} />}
            <Month
              month={month}
              bookingDayHandler={bookingDayHandler}
              setPeriod={setPeriod}
              withInteraction={withInteraction}
              hasCompletedRange={hasCompletedRange}
              rangeMarkerHandler={rangeMarkerHandler}
              resetCalendar={resetCalendar}
              calendar={calendar}
              bookingColors={newCalendar.presenter.vm.bookingColors}
              periodIsValid={periodIsValid}
              setPeriodIsValid={setPeriodIsValid}
              setDaysSelected={setDaysSelected}
              setNextDay={setNextDay}
              daysSelected={daysSelected}
              periodRules={periodRules}
              defaultMinimumDuration={defaultMinimumDuration}
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
