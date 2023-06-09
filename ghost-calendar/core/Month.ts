import { createDay } from "./helpers/createDay";
import { dateHandler } from "./helpers/date";
import {
  LocaleType,
  MonthType,
  Period,
  BookingColorType,
  WorldTimezones,
  PeriodRules,
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
      periodRules?: PeriodRules[];
    }
  ) {}

  private pushDayInMonth(day: DateType) {
    const belongsToThisMonth = day.get("month") === this.month?.monthKey;

    if (belongsToThisMonth) {
      this.month.days.push(createDay({ day, ...this.props }));
    } else {
      this.month.days.push({});
    }
  }

  getMonthUniqueId() {
    this.month.id = `${this.month.monthKey}-${this.month.yearKey}`;

    return this;
  }

  getMonthIndex(index: number) {
    this.month.index = index;

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

    for (let i = 0; i < MAX_DAYS_IN_MONTH; i++) {
      this.pushDayInMonth(
        dateHandler({
          date: firstDay,
          timezone: this.props.timezone,
        }).add(i, "day")
      );
    }

    return this;
  }

  build() {
    return { ...this.month };
  }
}
