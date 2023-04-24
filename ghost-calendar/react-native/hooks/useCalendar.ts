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
}: CalendarProps) => ({
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
  const [calendarState, setCalendarState] = useState<CalendarVM>(presenter.vm);
  const [initialMonths, setInitialMonths] = useState(presenter.vm.months);

  const setPeriod = (day: DayType) => {
    if (calendarState) {
      calendar.setPeriod(presenter, day, calendarState, initialMonths);

      presenter.subscribeVM((calendar) => {
        setCalendarState(calendar);
      });
    }
  };

  const clearCalendar = () => {
    calendar.clearCalendar(presenter, calendarState, initialMonths);

    presenter.subscribeVM((calendar) => {
      setCalendarState(calendar);
    });
  };

  const setPaginate = (operator: string) => {
    calendar.paginate(presenter, operator);

    presenter.subscribeVM((calendar) => {
      setCalendarState(calendar);
    });
  };

  useEffect(() => {
    calendar.build(presenter);
    presenter.subscribeVM((calendar) => {
      setCalendarState(calendar);
      setInitialMonths(calendar.months);
    });
  }, []);

  return {
    calendar: calendarState,
    setPeriod,
    setPaginate,
    resetCalendar: () => clearCalendar(),
  };
};
