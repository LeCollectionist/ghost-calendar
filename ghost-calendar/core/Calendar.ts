import {
  DayType,
  BookingColorType,
  BookingInfo,
  WorldTimezones,
  MonthType,
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
    }
  ) {}

  setPeriod(
    presenter: CalendarPresenter,
    day: DayType,
    calendarState: CalendarVM,
    initialMonths: MonthType[]
  ) {
    const canBeStartDate = !day.isStartDate && !day.isBooking && !day.isPastDay;
    const periodIsUncompleted =
      calendarState.checkIn && !calendarState.checkOut;
    const periodIsCompleted = calendarState.checkIn && calendarState.checkOut;
    const isEndDateOrBookingMarker = day.isEndDate || day.isRangeDate;

    const date = day.day as string;

    if (
      canBeStartDate ||
      isEndDateOrBookingMarker ||
      (day.isStartDate && calendarState.checkIn)
    ) {
      if (periodIsUncompleted) {
        notifyIfPeriodIsUncompleted(
          presenter,
          date,
          calendarState.checkIn,
          calendarState,
          initialMonths,
          this.props.timezone
        );
      } else if (periodIsCompleted) {
        presenter.displayStartDate(date, initialMonths, calendarState);
      } else {
        presenter.displayStartDate(date, calendarState.months, calendarState);
      }
    } else {
      presenter.displayInitializePeriod(initialMonths, calendarState);
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

    presenter.displayCalendar({
      period: {},
      checkIn: this.props.checkIn,
      checkOut: this.props.checkOut,
      visualMonth: this.props.visualMonth,
      bookingColors: this.props.bookingColors,
    });
  }
}
