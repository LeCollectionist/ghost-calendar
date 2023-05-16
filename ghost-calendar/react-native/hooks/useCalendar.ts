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
};

const createCalendar = ({
  locale,
  startDate,
  endDate,
  checkIn,
  checkOut,
  rangeDates,
  visualMonth,
  bookingColors,
  timezone,
}: Omit<CalendarProps, "calendarStore" | "setCalendarStore">) => ({
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
}: CalendarProps) => {
  const { calendar, presenter } = createCalendar({
    locale,
    startDate,
    endDate,
    checkIn,
    checkOut,
    rangeDates,
    visualMonth,
    bookingColors,
    timezone,
  });

  const [initialMonths, setInitialMonths] = useState(presenter.vm.months);

  const setPeriod = (day: DayType) => {
    if (calendarStore) {
      calendar.setPeriod(presenter, day, calendarStore, initialMonths);

      setCalendarStore(presenter.vm);
    }
  };

  const clearCalendar = () => {
    if (calendarStore) {
      calendar.clearCalendar(presenter, calendarStore, initialMonths);

      setCalendarStore(presenter.vm);
    }
  };

  const setPaginate = (operator: string) => {
    calendar.paginate(presenter, operator);

    setCalendarStore(presenter.vm);
  };

  useEffect(() => {
    calendar.build(presenter);
    setCalendarStore(presenter.vm);

    presenter.subscribeVM((calendar) => {
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
