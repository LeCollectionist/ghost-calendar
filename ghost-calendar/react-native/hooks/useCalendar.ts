import { useState, useEffect } from "react";

import {
  BookingColorType,
  Calendar,
  CalendarPresenter,
  CalendarVM,
  DayType,
  LocaleType,
  Period,
  PeriodRules,
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
  periodRules: PeriodRules[];
  defaultMinimumDuration?: number;
};

export const createCalendar = ({
  locale,
  startDate,
  timezone,
  ...otherProps
}: CalendarProps) => {
  const calendar = new Calendar({ startDate, timezone, ...otherProps });
  const presenter = new CalendarPresenter(locale, startDate, timezone);

  return { calendar, presenter };
};

export const useCalendar = ({
  newCalendar,
}: {
  newCalendar: { calendar: Calendar; presenter: CalendarPresenter };
}) => {
  const [calendar, setCalendar] = useState<CalendarVM>(
    newCalendar.presenter.vm
  );
  const [initialMonths, setInitialMonths] = useState(
    newCalendar.presenter.vm.months
  );

  const setPeriod = (day: DayType) => {
    newCalendar.calendar.setPeriod(
      newCalendar.presenter,
      day,
      calendar,
      initialMonths
    );

    setCalendar(newCalendar.presenter.vm);
  };

  const clearCalendar = () => {
    newCalendar.calendar.clearCalendar(
      newCalendar.presenter,
      calendar,
      initialMonths
    );

    setCalendar(newCalendar.presenter.vm);
  };

  const setPaginate = (operator: string) => {
    newCalendar.calendar.paginate(newCalendar.presenter, operator);

    setCalendar(newCalendar.presenter.vm);
  };

  useEffect(() => {
    newCalendar.presenter.subscribeVM((calendar) => {
      setCalendar(calendar);
      setInitialMonths(calendar.months);
    });
  }, []);

  return {
    calendar,
    setPeriod,
    setPaginate,
    resetCalendar: () => clearCalendar(),
  };
};
