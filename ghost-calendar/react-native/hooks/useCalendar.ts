import { useState, useEffect } from "react";

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

type CalendarProps = {
  locale: LocaleType;
  startDate: Date;
  endDate: Date;
  checkIn?: Date;
  checkOut?: Date;
  rangeDates: Required<Period>[];
  visualMonth: number;
  bookingColors: BookingColorType;
  timezone?: WorldTimezones;
  calendarStore: CalendarVM | null;
  setCalendarStore: (vm: CalendarVM) => void;
  calendarBuild: Calendar;
  calendarPresenter: CalendarPresenter;
};

export const createCalendar = ({
  locale,
  startDate,
  endDate,
  checkIn,
  checkOut,
  rangeDates,
  visualMonth,
  bookingColors,
  timezone,
}: Omit<
  CalendarProps,
  "calendarStore" | "setCalendarStore" | "calendarBuild" | "calendarPresenter"
>) => ({
  calendar: new Calendar({
    startDate,
    endDate,
    checkIn,
    checkOut,
    rangeDates,
    visualMonth,
    bookingColors,
    timezone,
  }),
  presenter: new CalendarPresenter(locale, startDate, timezone),
});

export const useCalendar = ({
  locale,
  startDate,
  endDate,
  checkIn,
  checkOut,
  rangeDates,
  visualMonth,
  bookingColors,
  timezone,
  calendarStore,
  setCalendarStore,
  calendarBuild,
  calendarPresenter,
}: CalendarProps) => {
  const [initialMonths, setInitialMonths] = useState(
    calendarPresenter.vm.months
  );

  const setPeriod = (day: DayType) => {
    if (calendarStore) {
      calendarBuild.setPeriod(
        calendarPresenter,
        day,
        calendarStore,
        initialMonths
      );

      setCalendarStore(calendarPresenter.vm);
    }
  };

  const clearCalendar = () => {
    if (calendarStore) {
      calendarBuild.clearCalendar(
        calendarPresenter,
        calendarStore,
        initialMonths
      );

      setCalendarStore(calendarPresenter.vm);
    }
  };

  const setPaginate = (operator: string) => {
    calendarBuild.paginate(calendarPresenter, operator);

    setCalendarStore(calendarPresenter.vm);
  };

  useEffect(() => {
    if (!calendarStore) {
      setCalendarStore(calendarPresenter.vm);
    }

    calendarPresenter.subscribeVM((calendar) => {
      setInitialMonths(calendar.months);
    });
  }, []);

  return {
    calendar: calendarStore,
    setPeriod,
    setPaginate,
    resetCalendar: () => clearCalendar(),
  };
};
