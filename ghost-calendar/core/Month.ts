import Day from "./Day";

import { dateHandler, isDatePassed } from "./helpers/date";
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
  DateType,
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

  private pushDayInMonth(day: DateType, currentDate: DateType) {
    const belongsToThisMonth = day.get("month") === this.month?.monthKey;

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
      const date = dateHandler({
        date: value.endDate,
        timezone: this.props.timezone,
      });

      if (!isDatePassed(date, this.props.timezone)) {
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
      getFirstDayOfMonth(
        dateHandler({ date: this.props.date, timezone: this.props.timezone }),
        this.props.timezone
      ),
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
      dateHandler({ date: this.props.date, timezone: this.props.timezone }),
      FIRST_DAY_OF_WEEK,
      this.props.timezone
    );
    const currentDate = dateHandler({ timezone: this.props.timezone });

    for (let i = 0; i < MAX_DAYS_IN_MONTH; i++) {
      const day = dateHandler({
        date: firstDay,
        timezone: this.props.timezone,
      }).add(i, "day");
      this.pushDayInMonth(day, currentDate);
    }

    return this;
  }

  build() {
    return { ...this.month };
  }
}
