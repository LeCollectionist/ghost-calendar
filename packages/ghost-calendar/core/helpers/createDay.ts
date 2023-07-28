import Day from "../Day";
import { dateHandler, isDatePassed } from "./date";
import { BookingColorType, Period, PeriodRules, WorldTimezones } from "./types";
import { DateType } from "./utils";

type CreateDayType = {
  day: DateType;
  period?: Period;
  rangeDates?: Required<Period>[];
  checkIn?: Date;
  checkOut?: Date;
  bookingColors?: BookingColorType;
  timezone?: WorldTimezones;
  periodRules?: PeriodRules[];
  defaultMinimumDuration?: number;
};

const excludePastDate = (
  rangeDates: Required<Period>[],
  timezone?: WorldTimezones
) => {
  let range: Required<Period>[] = [];

  rangeDates.forEach((value) => {
    const date = dateHandler({
      date: value.endDate,
      timezone,
    });

    if (!isDatePassed(date, timezone)) {
      range.push(value);
    }
  });

  return range;
};

export const createDay = (props: CreateDayType) => {
  const currentDate = dateHandler({ timezone: props.timezone });

  const day = new Day(props.day)
    .getDate()
    .getDayNumber()
    .dayManagement(excludePastDate(props.rangeDates || [], props.timezone), {
      bookingColors: props.bookingColors,
    })
    .isCurrentDay(currentDate)
    .isPast(currentDate)
    .isStartDate(props.period?.startDate)
    .isEndDate(props.period?.endDate)
    .setRangeDate(props.period, props.checkIn, props.checkOut)
    .isCheckInCheckOut(props.checkIn, props.checkOut)
    .isHalfDay()
    .setPeriodRules(props.periodRules)
    .setDefaultPeriodRules(props.periodRules, props.defaultMinimumDuration);

  return day.build();
};
