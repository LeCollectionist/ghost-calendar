import {
  DayType,
  BookingColorType,
  BookingInfo,
  WorldTimezones,
  MonthType,
  PeriodRules,
} from "./helpers/types";
import { notifyIfPeriodIsUncompleted } from "./helpers/notifiers";

import { CalendarPresenter, CalendarVM } from "./CalendarPresenter";

export default class Calendar {
  constructor(
    private props: {
      startDate: Date;
      endDate: Date;
      checkIn?: Date;
      checkOut?: Date;
      rangeDates: BookingInfo[];
      visualMonth: number;
      bookingColors: BookingColorType;
      timezone?: WorldTimezones;
      periodRules: PeriodRules[];
    }
  ) {}

  private periodIsCompleted(
    presenter: CalendarPresenter,
    day: DayType,
    calendarState: CalendarVM,
    initialMonths: MonthType[]
  ) {
    const isUncompleted = Boolean(
      calendarState.checkIn && !calendarState.checkOut
    );
    const date = day.day as string;

    if (isUncompleted) {
      notifyIfPeriodIsUncompleted(
        presenter,
        date,
        calendarState.checkIn,
        calendarState,
        initialMonths,
        this.props.timezone
      );

      return false;
    }

    return true;
  }

  private setStartDate(
    presenter: CalendarPresenter,
    day: DayType,
    calendarState: CalendarVM,
    initialMonths: MonthType[]
  ) {
    const date = day.day as string;
    const isCompleted = Boolean(
      calendarState.checkIn && calendarState.checkOut
    );

    if (isCompleted)
      presenter.displayStartDate(date, initialMonths, calendarState);
    else presenter.displayStartDate(date, calendarState.months, calendarState);
  }

  setPeriod(
    presenter: CalendarPresenter,
    day: DayType,
    calendarState: CalendarVM,
    initialMonths: MonthType[]
  ) {
    if (Object.keys(day).length > 0) {
      const canBeStartDate =
        !day.isStartDate && !day.isBooking && !day.isPastDay;
      const isEndDateOrBookingMarker = day.isEndDate || day.isRangeDate;
      if (
        canBeStartDate ||
        isEndDateOrBookingMarker ||
        (day.isStartDate && calendarState.checkIn)
      ) {
        const isCompleted = this.periodIsCompleted(
          presenter,
          day,
          calendarState,
          initialMonths
        );
        if (isCompleted) {
          this.setStartDate(presenter, day, calendarState, initialMonths);
        }
      } else {
        presenter.displayInitializePeriod(initialMonths, calendarState);
      }
    }
  }

  paginate(presenter: CalendarPresenter, operator: string) {
    presenter.paginate(operator, this.props.checkIn, this.props.checkOut);
  }

  clearCalendar(
    presenter: CalendarPresenter,
    calendarState: CalendarVM,
    initialMonths: MonthType[]
  ) {
    presenter.displayInitializePeriod(initialMonths, calendarState);
  }

  private setStartDateAndEndDate() {
    if (!this.props.startDate) {
      this.props.startDate = new Date();
    }
    if (!this.props.endDate) {
      this.props.endDate = new Date(new Date().getFullYear() + 2, 0, 1);
    }
  }

  private setNbMonth(presenter: CalendarPresenter) {
    presenter.displayMonthRange(this.props.visualMonth);
  }

  build(presenter: CalendarPresenter) {
    this.setStartDateAndEndDate();
    this.setNbMonth(presenter);

    presenter.displayRangeDates(this.props.rangeDates);
    presenter.displayPeriodRules(this.props.periodRules);

    presenter.displayCalendar({
      period: {},
      checkIn: this.props.checkIn,
      checkOut: this.props.checkOut,
      visualMonth: this.props.visualMonth,
      bookingColors: this.props.bookingColors,
    });
  }
}
