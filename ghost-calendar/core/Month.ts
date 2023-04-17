import Day from "./Day";

import { date, isDatePassed } from "./helpers/date";
import {
  LocaleType,
  MonthType,
  Period,
  BookingColorType,
} from "./helpers/types";
import {
  getMonthName,
  getFirstDayOfMonth,
  getFirstDayOfFirstWeekOfMonth,
  getDateWithoutTimeZone,
} from "./helpers/utils";

const FIRST_DAY_OF_WEEK = 1;
const MAX_DAYS_IN_MONTH = 42;

export default class Month {
  private month: MonthType = { days: [] };

  constructor(
    private props: {
      date: Date;
      period?: Period;
      rangeDates?: Required<Period>[];
      checkIn?: Date;
      checkOut?: Date;
      bookingColors?: BookingColorType;
    }
  ) {}

  private pushDayInMonth(day: Date, currentDate: Date) {
    const belongsToThisMonth = day.getMonth() === this.month?.monthKey;

    if (belongsToThisMonth) {
      this.month.days.push(
        new Day(day)
          .getDate()
          .getDayNumber()
          .dayManagement(this.excludePastDate(this.props.rangeDates || []), {
            bookingColors: this.props.bookingColors,
          })
          .isCurrentDay(currentDate)
          .isPast(currentDate)
          .isStartDate(this.props.period?.startDate)
          .isEndDate(this.props.period?.endDate)
          .setRangeDate(
            this.props.period,
            this.props.checkIn,
            this.props.checkOut
          )
          .isCheckInCheckOut(this.props.checkIn, this.props.checkOut)
          .isHalfDay()
          .build()
      );
    } else {
      this.month.days.push({});
    }
  }

  private excludePastDate(rangeDates: Required<Period>[]) {
    let range: Required<Period>[] = [];

    rangeDates.forEach((value) => {
      const date = new Date(value.endDate);

      if (!isDatePassed(date)) {
        range.push(value);
      }
    });

    return range;
  }

  getMonthUniqueId() {
    this.month.id = `${this.month.monthKey}-${this.month.yearKey}`;

    return this;
  }

  getMonthKey() {
    this.month = { days: [] };
    this.month.monthKey = this.props.date.getMonth();

    return this;
  }

  getMonthName(locale: LocaleType) {
    this.month.monthName = getMonthName(
      getFirstDayOfMonth(this.props.date),
      locale
    );

    return this;
  }

  getMonthYearKey() {
    this.month.yearKey = this.props.date.getFullYear();

    return this;
  }

  getMonth() {
    const firstDay = getFirstDayOfFirstWeekOfMonth(
      this.props.date,
      FIRST_DAY_OF_WEEK
    );
    const currentDate = getDateWithoutTimeZone(new Date());

    for (let i = 0; i < MAX_DAYS_IN_MONTH; i++) {
      const day = date(firstDay).addDays(i) as unknown as Date;
      const newDay = getDateWithoutTimeZone(day);

      this.pushDayInMonth(newDay, currentDate);
    }

    return this;
  }

  build() {
    return { ...this.month };
  }
}
