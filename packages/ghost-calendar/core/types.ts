import {
  BookingColorType,
  DayType,
  Period,
  PeriodRules,
} from "./helpers/types";

export type DisplayCalendarType = {
  period?: Period;
  checkIn?: Date;
  checkOut?: Date;
  visualMonth?: number;
  bookingColors?: BookingColorType;
};

export type DisplaySelectedDateType = {
  period: Period;
  selectedDate: string;
  checkIn?: Date;
  checkOut?: Date;
  bookingColors?: BookingColorType;
  rangeDates?: Required<Period>[];
  periodRules?: PeriodRules[];
};

export type DaysManagementType = {
  period: Period;
  selectedDate: string;
  checkIn?: Date;
  checkOut?: Date;
  bookingColors?: BookingColorType;
  rangeDates?: Required<Period>[];
  days: DayType[];
  startDateDay: DayType;
};

export type GetOtherMonthsChoosedType = {
  startDateMonth: number;
  endDateMonth: number;
  monthId: string;
  days: DisplaySelectedDateType;
  startDateDay: DayType;
};
