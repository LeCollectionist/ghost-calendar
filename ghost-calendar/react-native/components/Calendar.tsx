import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
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
import React, { memo, useState } from "react";
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

const CalendarComponent = memo(
  ({
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
    const { height, width } = useWindowDimensions();
    const [isValid, setPeriodIsValid] = useState(true);
    const [daysSelected, setDaysSelected] = useState<DayType[]>([]);
    const [nextDay, setNextDay] = useState<PeriodRules | null>(null);
    const { calendar, setPeriod, resetCalendar } = useCalendar({
      newCalendar,
    });

    if (!calendar) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    if (calendar.months.length === 0) return null;

    return (
      <View>
        <Week locale={locale} />
        {!isValid && periodIsValid && (
          <PeriodInfo locale={locale} nextDay={nextDay} />
        )}
        <View style={{ height, width }}>
          <FlashList
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 12,
              paddingBottom: 300,
            }}
            estimatedItemSize={150}
            estimatedListSize={{ height, width }}
            showsVerticalScrollIndicator={false}
            data={calendar.months}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item: month, index }) => {
              return (
                <View key={`${month.id}${index}`}>
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
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
);

export default CalendarComponent;
