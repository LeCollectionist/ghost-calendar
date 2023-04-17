import Day from "./Day";

import { date, isDatePassed } from "./helpers/date";
import {
  LocaleType,
  MonthType,
  Period,
  BookingColorType,
  WorldTimezones,
} from "./helpers/types";
import {
  getMonthName,
  getFirstDayOfMonth,
  getFirstDayOfFirstWeekOfMonth,
  getDateWithTimeZone,
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
      timezone?: WorldTimezones;
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
      const date = getDateWithTimeZone(
        new Date(value.endDate),
        this.props.timezone
      );

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
      getFirstDayOfMonth(this.props.date, this.props.timezone),
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
      FIRST_DAY_OF_WEEK,
      this.props.timezone
    );
    const currentDate = getDateWithTimeZone(new Date(), this.props.timezone);

    for (let i = 0; i < MAX_DAYS_IN_MONTH; i++) {
      const day = date(firstDay).addDays(i) as unknown as Date;

      this.pushDayInMonth(day, currentDate);
    }

    return this;
  }

  build() {
    return { ...this.month };
  }
}
