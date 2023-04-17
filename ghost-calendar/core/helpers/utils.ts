import { CalendarPresenter } from "../CalendarPresenter";

import XDate from "xdate";
import { DayType, MonthType, LocaleType, WorldTimezones } from "./types";
import { date, dayFormatter } from "./date";

export const getMonthName = (day: Date, locale?: LocaleType): string => {
  const currentMonth = date(day).toString("MMMM", locale);
  const currentYear = date(day).toString("yyyy");

  return `${currentMonth} ${currentYear}`;
};

export const getFirstDayOfMonth = (date: Date, timezone?: WorldTimezones) => {
  return getDateWithTimeZone(
    new Date(date.getFullYear(), date.getMonth(), 1),
    timezone
  ) as unknown as Date;
};

export const getFirstDayOfFirstWeekOfMonth = (
  day: Date,
  firstDayOfWeek: number,
  timezone?: WorldTimezones
) => {
  const firstDay = getFirstDayOfMonth(day, timezone);
  let offset = firstDayOfWeek - firstDay.getDay();

  if (offset > 0) {
    offset -= 7;
  }

  return date(firstDay.setDate(firstDay.getDate() + offset));
};

export const checkCurrentDayAndPastDay = (
  date: string,
  currentDay: Date,
  timezone?: WorldTimezones
) => {
  return (
    getDateWithTimeZone(new Date(date), timezone).getTime() <
    getDateWithTimeZone(
      new Date(dayFormatter(currentDay, "yyyy-MM-dd")),
      timezone
    ).getTime()
  );
};

export const checkBetweenDates = (
  startDate: string,
  endDate: string,
  currentDate: string | undefined
) => {
  if (currentDate) {
    const startDateTime = date(new Date(startDate)).getTime();
    const endDateTime = date(new Date(endDate)).getTime();
    const currentDateTime = date(new Date(currentDate)).getTime();

    if (currentDateTime > startDateTime && currentDateTime < endDateTime) {
      return true;
    }

    return false;
  }
};

const findMonth = (
  presenter: CalendarPresenter,
  endDateMonth: number,
  endDateYear: number
) => {
  return presenter.vm.months.find((month) => {
    if (month.monthKey === endDateMonth && month.yearKey === endDateYear) {
      return month;
    }
  });
};

const pushBookingDates = (
  monthFound: MonthType | undefined,
  startDate: Date,
  endDate: Date,
  bookingDate: DayType[]
) => {
  if (monthFound) {
    const daysFound = monthFound.days.filter((day) => {
      if (day.day) {
        if (
          !checkCurrentDayAndPastDay(day.day, startDate) &&
          checkCurrentDayAndPastDay(day.day, endDate)
        ) {
          return day;
        }
      }
    });

    daysFound.forEach((day) => {
      if (day.isBooking && !day.isEndDate && !day.isStartDate) {
        bookingDate.push(day);
      }
    });
  }
};

export const getMonthDiff = (
  d1: Date,
  d2: Date,
  timezone?: WorldTimezones
): number => {
  let months;
  months =
    (getDateWithTimeZone(d2, timezone).getFullYear() -
      getDateWithTimeZone(d1, timezone).getFullYear()) *
    12;
  months -= getDateWithTimeZone(d1, timezone).getMonth();
  months += getDateWithTimeZone(d2, timezone).getMonth();

  return months <= 0 ? 0 : months;
};

// Todo: Refacto this function
export const getBookingDates = (
  presenter: CalendarPresenter,
  startDayState: string,
  endDayState: string,
  timezone?: WorldTimezones
) => {
  const endDate = getDateWithTimeZone(
    new Date(endDayState),
    timezone
  ) as unknown as Date;
  const startDate = getDateWithTimeZone(
    new Date(startDayState),
    timezone
  ) as unknown as Date;
  const bookingDate: DayType[] = [];

  const startDateMonth = startDate.getMonth();
  const startDateYear = startDate.getFullYear();
  const endDateMonth = endDate.getMonth();
  const endDateYear = endDate.getFullYear();

  if (endDateMonth === startDateMonth) {
    const monthFound = findMonth(presenter, endDateMonth, endDateYear);

    pushBookingDates(monthFound, startDate, endDate, bookingDate);
  } else if (endDateMonth > startDateMonth && startDateYear === endDateYear) {
    const fistMonthFound = findMonth(presenter, startDateMonth, startDateYear);
    const secondMonthFound = findMonth(presenter, endDateMonth, endDateYear);

    pushBookingDates(fistMonthFound, startDate, endDate, bookingDate);
    pushBookingDates(secondMonthFound, startDate, endDate, bookingDate);
  } else if (startDateYear < endDateYear) {
    const fistMonthFound = findMonth(presenter, startDateMonth, startDateYear);
    const secondMonthFound = findMonth(presenter, endDateMonth, endDateYear);

    pushBookingDates(fistMonthFound, startDate, endDate, bookingDate);
    pushBookingDates(secondMonthFound, startDate, endDate, bookingDate);
  }

  return bookingDate;
};

export const getDateWithTimeZone = (
  date: Date,
  timeZone: WorldTimezones = "Europe/Paris"
) => {
  const timeZoneDay = date.toLocaleString("en", { timeZone }).split(/[-, :]/);
  const timeZonedate = timeZoneDay[0].split("/");
  const newTimeZonedate = `${timeZonedate[2]}-${timeZonedate[0]}-${timeZonedate[1]}`;

  return new XDate(newTimeZonedate, true)
    .setHours(Number(timeZoneDay[2]))
    .setMinutes(Number(timeZoneDay[3]))
    .setSeconds(Number(timeZoneDay[4])) as unknown as Date;
};
