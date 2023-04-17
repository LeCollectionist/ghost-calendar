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
  const [calendarState, setCalendarState] = useState<CalendarVM | null>(null);

  const presenter = new CalendarPresenter(locale, startDate, timezone);
  const calendar = new Calendar({
    startDate,
    endDate,
    checkIn,
    checkOut,
    rangeDates,
    visualMonth,
    bookingColors,
    timezone,
  });

  calendar.build(presenter);

  const setPeriod = (day: DayType) => {
    if (calendarState) {
      calendar.setPeriod(
        presenter,
        day,
        calendarState.checkIn,
        calendarState.checkOut
      );

      presenter.subscribeVM((calendar) => {
        setCalendarState(calendar);
      });
    }
  };

  const clearCalendar = () => {
    calendar.clearCalendar(presenter);

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
    presenter.subscribeVM((calendar) => {
      setCalendarState(calendar);
    });
  }, []);

  return {
    calendar: calendarState,
    setPeriod,
    setPaginate,
    resetCalendar: () => clearCalendar(),
  };
};
