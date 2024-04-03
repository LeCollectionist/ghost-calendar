import dayjs from "dayjs";

import { CalendarPresenter, CalendarVM } from "../CalendarPresenter";
import { DayType, MonthType, LocaleType, WorldTimezones } from "./types";
import { dateHandler, dayFormatter } from "./date";

export type DateType = dayjs.Dayjs;

export const getMonthName = (day: DateType, locale?: LocaleType): string => {
  const currentMonth = dateHandler({ date: day })
    .locale(locale || "en")
    .format("MMMM");
  const currentYear = dateHandler({ date: day }).format("YYYY");

  return `${currentMonth} ${currentYear}`;
};

export const getFirstDayOfMonth = (
  date: DateType,
  timezone?: WorldTimezones
) => {
  return dateHandler({
    date: new Date(date.get("year"), date.get("month"), 1),
    timezone,
  });
};

export const getFirstDayOfFirstWeekOfMonth = (
  day: DateType,
  firstDayOfWeek: number,
  timezone?: WorldTimezones
) => {
  const firstDay = getFirstDayOfMonth(day, timezone);
  let offset = firstDayOfWeek - firstDay.get("day");

  if (offset > 0) {
    offset -= 7;
  }

  return dateHandler({
    date: firstDay.set("date", firstDay.get("date") + offset),
    timezone,
  });
};

export const checkCurrentDayAndPastDay = (
  date: string,
  currentDay: DateType
) => {
  return (
    new Date(date).getTime() <
    new Date(dayFormatter(currentDay, "YYYY-MM-DD")).getTime()
  );
};

export const getDatesBetween = (
  startDate: string,
  endDate: string
): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  // Boucler jusqu'à ce que la date actuelle atteigne la dernière date
  while (currentDate <= lastDate) {
    // Formater la date actuelle au format "YYYY-MM-DD"
    const formattedDate = currentDate.toISOString().slice(0, 10);

    // Ajouter la date au tableau
    dates.push(formattedDate);

    // Passer à la prochaine date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const checkBetweenDates = (
  startDate: string,
  endDate: string,
  currentDate: string | undefined
) => {
  if (currentDate) {
    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
    const currentDateTime = new Date(currentDate).getTime();

    if (currentDateTime > startDateTime && currentDateTime < endDateTime) {
      return true;
    }

    return false;
  }

  return false;
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

    return undefined;
  });
};

const findMonthsBetweenTwoDates = (
  startKeyMonth: number,
  endKeyMonth: number
) => {
  const numberList: number[] = [];

  for (let i = startKeyMonth; i <= endKeyMonth; i++) {
    numberList.push(i);
  }

  return numberList;
};

const pushBookingDates = (
  monthFound: MonthType | undefined,
  startDate: DateType,
  endDate: DateType,
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

      return undefined;
    });

    daysFound.forEach((day) => {
      if (day.isBooking && (!day.isEndDate || !day.isStartDate)) {
        bookingDate.push(day);
      }
    });
  }
};

const pushBookingRangeDates = (
  monthFound: MonthType | undefined,
  startDate: DateType,
  endDate: DateType,
  bookingDate: DayType[]
) => {
  if (monthFound && monthFound.rangeDates) {
    const daysFound = monthFound.rangeDates.filter((day) => {
      if (day.day) {
        if (
          !checkCurrentDayAndPastDay(day.day, startDate) &&
          checkCurrentDayAndPastDay(day.day, endDate)
        ) {
          return day;
        }
      }

      return undefined;
    });

    daysFound.forEach((day) => {
      if (
        day.isBooking &&
        (!day.isEndDate || !day.isStartDate) &&
        day.day !== dayFormatter(startDate, "YYYY-MM-DD")
      ) {
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
    (dateHandler({ date: d2, timezone }).get("year") -
      dateHandler({ date: d1, timezone }).get("year")) *
    12;
  months -= dateHandler({ date: d1, timezone }).get("month");
  months += dateHandler({ date: d2, timezone }).get("month");

  return months <= 0 ? 0 : months;
};

// Todo: Refacto this function
export const getBookingDates = (
  presenter: CalendarPresenter,
  startDayState: string,
  endDayState: string,
  timezone?: WorldTimezones
) => {
  const endDate = dateHandler({ date: endDayState, timezone });
  const startDate = dateHandler({ date: startDayState, timezone });
  const bookingDate: DayType[] = [];

  const startDateMonth = startDate.get("month");
  const startDateYear = startDate.get("year");
  const endDateMonth = endDate.get("month");
  const endDateYear = endDate.get("year");

  const diffDays = dayjs(endDayState).diff(startDayState, "day");

  if (diffDays > 1) {
    if (endDateMonth === startDateMonth) {
      const monthFound = findMonth(presenter, endDateMonth, endDateYear);

      if (monthFound?.rangeDates) {
        pushBookingRangeDates(monthFound, startDate, endDate, bookingDate);
      } else {
        pushBookingDates(monthFound, startDate, endDate, bookingDate);
      }
    } else if (endDateMonth > startDateMonth && startDateYear === endDateYear) {
      const keyMonthsList = findMonthsBetweenTwoDates(
        startDateMonth,
        endDateMonth
      );
      keyMonthsList.forEach((value) => {
        const monthFound = findMonth(presenter, value, startDateYear);
        if (monthFound?.rangeDates) {
          pushBookingRangeDates(monthFound, startDate, endDate, bookingDate);
        } else {
          pushBookingDates(monthFound, startDate, endDate, bookingDate);
        }
      });
    } else if (startDateYear < endDateYear) {
      const fistMonthFound = findMonth(
        presenter,
        startDateMonth,
        startDateYear
      );
      const secondMonthFound = findMonth(presenter, endDateMonth, endDateYear);

      if (fistMonthFound?.rangeDates) {
        pushBookingRangeDates(fistMonthFound, startDate, endDate, bookingDate);
      } else {
        pushBookingDates(fistMonthFound, startDate, endDate, bookingDate);
      }

      if (secondMonthFound?.rangeDates) {
        pushBookingRangeDates(
          secondMonthFound,
          startDate,
          endDate,
          bookingDate
        );
      } else {
        pushBookingDates(secondMonthFound, startDate, endDate, bookingDate);
      }
    }
  }

  return bookingDate;
};

const findMonthT = (
  presenter: CalendarVM,
  endDateMonth: number,
  endDateYear: number
) => {
  return presenter.months.find((month) => {
    if (month.monthKey === endDateMonth && month.yearKey === endDateYear) {
      return month;
    }

    return undefined;
  });
};

// Todo: Refacto this function
export const getBookingDateUi = (
  calendar: CalendarVM,
  startDayState: string,
  endDayState: string,
  timezone?: WorldTimezones
) => {
  const endDate = dateHandler({ date: endDayState, timezone });
  const startDate = dateHandler({ date: startDayState, timezone });
  const bookingDate: DayType[] = [];

  const startDateMonth = startDate.get("month");
  const startDateYear = startDate.get("year");
  const endDateMonth = endDate.get("month");
  const endDateYear = endDate.get("year");
  const diffDays = dayjs(endDayState).diff(startDayState, "day");

  if (diffDays > 1) {
    if (endDateMonth === startDateMonth) {
      const monthFound = findMonthT(calendar, endDateMonth, endDateYear);

      if (monthFound?.rangeDates) {
        pushBookingRangeDates(monthFound, startDate, endDate, bookingDate);
      } else {
        pushBookingDates(monthFound, startDate, endDate, bookingDate);
      }
    } else if (endDateMonth > startDateMonth && startDateYear === endDateYear) {
      const keyMonthsList = findMonthsBetweenTwoDates(
        startDateMonth,
        endDateMonth
      );
      keyMonthsList.forEach((value) => {
        const monthFound = findMonthT(calendar, value, startDateYear);
        if (monthFound?.rangeDates) {
          pushBookingRangeDates(monthFound, startDate, endDate, bookingDate);
        } else {
          pushBookingDates(monthFound, startDate, endDate, bookingDate);
        }
      });
    } else if (startDateYear < endDateYear) {
      const fistMonthFound = findMonthT(
        calendar,
        startDateMonth,
        startDateYear
      );
      const secondMonthFound = findMonthT(calendar, endDateMonth, endDateYear);

      if (fistMonthFound?.rangeDates) {
        pushBookingRangeDates(fistMonthFound, startDate, endDate, bookingDate);
      } else {
        pushBookingDates(fistMonthFound, startDate, endDate, bookingDate);
      }

      if (secondMonthFound?.rangeDates) {
        pushBookingRangeDates(
          secondMonthFound,
          startDate,
          endDate,
          bookingDate
        );
      } else {
        pushBookingDates(secondMonthFound, startDate, endDate, bookingDate);
      }
    }
  }

  return bookingDate;
};
