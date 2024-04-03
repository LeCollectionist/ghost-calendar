import { dateHandler, dayFormatter } from "./helpers/date";
import { PeriodType, WEEKLY_DAYS_NUMBER } from "./helpers/periodRules";
import { DayType, Period, PeriodRules } from "./helpers/types";
import {
  checkCurrentDayAndPastDay,
  checkBetweenDates,
  DateType,
} from "./helpers/utils";

export default class Day {
  private day: DayType = {};

  constructor(private currentDay: DateType) {}

  getDate() {
    this.day.day = dayFormatter(this.currentDay, "YYYY-MM-DD");

    return this;
  }

  getDayNumber() {
    this.day.dayNumber = dayFormatter(this.currentDay, "D");

    return this;
  }

  isCurrentDay(date: DateType) {
    if (
      dayFormatter(this.currentDay, "YYYY-MM-DD") ===
      dayFormatter(date, "YYYY-MM-DD")
    ) {
      this.day.isCurrentDay = true;
    }

    return this;
  }

  isPast(date: DateType) {
    if (this.day.day && checkCurrentDayAndPastDay(this.day.day, date)) {
      this.day.isPastDay = true;
    }

    return this;
  }

  isCheckInCheckOut(checkIn?: Date, checkOut?: Date) {
    if (checkIn && dayFormatter(checkIn, "YYYY-MM-DD") === this.day.day) {
      this.day.isStartDate = true;
    } else if (
      checkOut &&
      dayFormatter(checkOut, "YYYY-MM-DD") === this.day.day
    ) {
      this.day.isEndDate = true;
    }

    return this;
  }

  isStartDate(day: string | undefined) {
    if (this.day.day === day) {
      this.day.isStartDate = true;
      this.day.isSelectedDate = true;
    }

    return this;
  }

  isEndDate(day: string | undefined) {
    if (this.day.day === day) {
      this.day.isEndDate = true;
      this.day.isSelectedDate = true;
    }

    return this;
  }

  isHalfDay() {
    if (this.day.isStartDate && this.day.isEndDate) this.day.isHalfDay = true;

    return this;
  }

  setRangeDate(period?: Period, checkIn?: Date, checkOut?: Date) {
    if (
      checkIn &&
      checkOut &&
      checkBetweenDates(
        dayFormatter(checkIn, "YYYY-MM-DD"),
        dayFormatter(checkOut, "YYYY-MM-DD"),
        this.day.day
      )
    )
      this.day.isRangeDate = true;

    if (period?.startDate && period?.endDate) {
      if (checkBetweenDates(period.startDate, period.endDate, this.day.day))
        this.day.isRangeDate = true;
    }

    return this;
  }

  setPeriodRules(periodRules: PeriodRules[] | undefined) {
    if (periodRules && periodRules.length > 0) {
      periodRules.forEach((rule) => {
        const isStartAt = rule.startAt === this.day.day;
        const isBetween = checkBetweenDates(
          rule.startAt,
          rule.endAt,
          this.day.day
        );
        const isEndAt = rule.endAt === this.day.day;

        if ((!this.day.periodType && isStartAt) || isBetween || isEndAt) {
          this.day.minimunDuration = rule.minimumDuration;
          this.day.periodType = rule.periodType;
          this.day.periodRange = {
            startDate: rule.startAt,
            endDate: rule.endAt,
          };
        }

        if (isStartAt) {
          this.day.startPeriod = true;
          this.day.isInPeriod = true;
        }
        if (isEndAt) {
          this.day.endPeriod = true;
          this.day.isInPeriod = true;
        }
        if (isBetween) {
          if (
            this.day.periodType?.includes("weekly") &&
            this.day.minimunDuration
          ) {
            const diffDay = dateHandler({ date: this.day.day }).diff(
              dateHandler({ date: rule.startAt }),
              "days"
            );
            const d = dateHandler({ date: this.day.day }).get("day");
            const test = WEEKLY_DAYS_NUMBER[this.day.periodType as PeriodType];
            if (d === test && diffDay % this.day.minimunDuration === 0) {
              this.day.isInPeriod = true;
            }
          }

          if (this.day.periodType === "nightly") {
            this.day.isInPeriod = true;
          }
        }
      });
    }
    return this;
  }

  setDefaultPeriodRules(
    periodRules: PeriodRules[] | undefined,
    defaultMinimumDuration?: number
  ) {
    if (!this.day.periodType && periodRules && periodRules.length > 0) {
      this.day.periodType = "nightly";
      this.day.minimunDuration = defaultMinimumDuration || 1;
      this.day.isInPeriod = true;
    }
    return this;
  }

  isBooking(day: Required<Period>) {
    if (day.startDate === this.day.day) {
      this.day.isStartDate = true;
      this.day.isBooking = true;
    }

    if (checkBetweenDates(day.startDate, day.endDate, this.day.day))
      this.day.isBooking = true;

    if (day.endDate === this.day.day) {
      this.day.isEndDate = true;
      this.day.isBooking = true;
    }
  }

  build() {
    return { ...this.day };
  }
}
