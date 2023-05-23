import Month from "./Month";
import Presenter from "./Presenter";
import {
  checkBetweenDates,
  getBookingDates,
  getMonthDiff,
} from "./helpers/utils";
import {
  LocaleType,
  MonthType,
  Period,
  BookingColorType,
  WorldTimezones,
  DayType,
} from "./helpers/types";
import { dateHandler } from "./helpers/date";
import { createDay } from "./helpers/createDay";

export class CalendarVM {
  checkOut = "";
  months: MonthType[] = [];
  rangeDates: Required<Period>[] = [];
  checkIn = "";
  visualMonth: number = 2;
  activeIndex: number = 0;
  bookingColors: BookingColorType = {};
}

export class CalendarPresenter extends Presenter<CalendarVM> {
  private nextMonth: Date;
  private dates: Date[] = [];

  constructor(
    private locale?: LocaleType,
    private startMonth?: Date,
    private timezone?: WorldTimezones
  ) {
    super(new CalendarVM());
    this.nextMonth = this.startMonth || new Date();
  }

  private getNextMonth(date: Date, countMonth: number) {
    if (countMonth === 0) {
      this.nextMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    } else {
      this.nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }

    return this.nextMonth;
  }

  private generateMonths(props: {
    period?: Period;
    checkIn?: Date;
    checkOut?: Date;
    bookingColors?: BookingColorType;
  }) {
    if (this.vm.months.length === 0) {
      for (let d = 0; d < this.dates.length; d++) {
        const currentDate = this.dates[d];
        this.vm.months.push(
          new Month({
            date: currentDate,
            period: props.period,
            rangeDates: this.vm.rangeDates,
            checkIn: props.checkIn,
            checkOut: props.checkOut,
            bookingColors: props.bookingColors,
            timezone: this.timezone,
          })
            .getMonthKey()
            .getMonthName(this.locale)
            .getMonthYearKey()
            .getMonthUniqueId()
            .getMonth()
            .getMonthIndex(d)
            .build()
        );
      }
    } else {
      if (props.period && props.period.startDate && !props.period.endDate) {
        this.displaySelectedDate({
          ...props,
          period: props.period,
          selectedDate: props.period.startDate,
          rangeDates: this.vm.rangeDates,
        });
      }

      if (props.period && props.period.startDate && props.period.endDate) {
        this.displaySelectedDate({
          ...props,
          period: props.period,
          selectedDate: props.period.endDate,
          rangeDates: this.vm.rangeDates,
        });
      }
    }

    if (this.vm.visualMonth) {
      this.vm.months = this.vm.months.slice(
        this.vm.activeIndex,
        this.vm.visualMonth + this.vm.activeIndex
      );
    }
  }

  setActiveIndex(checkIn: Date, checkOut: Date) {
    if (checkIn && checkOut) {
      const startDate = new Date();
      const startIndex = getMonthDiff(startDate, checkIn, this.timezone);

      this.vm.activeIndex = startIndex;
    } else {
      this.vm.activeIndex = 0;
    }
  }

  paginate(operator: string, checkIn?: Date, checkOut?: Date) {
    if (operator === "+") {
      this.vm.activeIndex += 1;
      this.generateMonths({
        period: {},
        checkIn,
        checkOut,
        bookingColors: this.vm.bookingColors,
      });
    } else if (operator === "-") {
      this.vm.activeIndex -= 1;
      this.generateMonths({
        period: {},
        checkIn,
        checkOut,
        bookingColors: this.vm.bookingColors,
      });
    }
  }

  displayRangeDates(rangeDates: Required<Period>[]) {
    this.vm.rangeDates = rangeDates;
    this.notifyVM();
  }

  displayMonthRange(max: number) {
    for (let countMonth = 0; countMonth < max; countMonth++) {
      const tempNextMonth = this.getNextMonth(this.nextMonth, countMonth);

      this.dates.push(tempNextMonth);
      this.nextMonth = tempNextMonth;
    }
    this.notifyVM();
  }

  displayInitializePeriod(months: MonthType[], calendarState: CalendarVM) {
    this.vm.checkIn = "";
    this.vm.checkOut = "";
    this.vm.months = [];
    this.vm.visualMonth = calendarState.visualMonth;
    this.vm.rangeDates = calendarState.rangeDates;
    this.displayCalendar({
      period: { startDate: "", endDate: "" },
      bookingColors: this.vm.bookingColors,
    });
    this.notifyVM();
  }

  displayStartDate(
    day: string,
    months: MonthType[],
    calendarState: CalendarVM
  ) {
    this.vm.checkIn = day;
    this.vm.checkOut = "";
    this.vm.months = months;
    this.vm.visualMonth = calendarState.visualMonth;
    this.vm.rangeDates = calendarState.rangeDates;
    this.displayCalendar({
      period: { startDate: day, endDate: "" },
      bookingColors: this.vm.bookingColors,
    });
    this.notifyVM();
  }

  displayEndDate(
    day: string,
    startDayState: string,
    calendarState: CalendarVM,
    initialMonths: MonthType[]
  ) {
    this.vm.months = calendarState.months;
    this.vm.visualMonth = calendarState.visualMonth;
    this.vm.rangeDates = calendarState.rangeDates;
    if (getBookingDates(this, startDayState, day, this.timezone).length > 0) {
      this.vm.months = initialMonths;
      this.vm.checkIn = day;
      this.vm.checkOut = "";
    } else {
      this.vm.checkIn = startDayState;
      this.vm.checkOut = day;

      if (this.vm.checkIn === this.vm.checkOut) {
        this.displayInitializePeriod(initialMonths, calendarState);
      }
    }
    this.displayCalendar({
      period: { startDate: this.vm.checkIn, endDate: this.vm.checkOut },
      bookingColors: this.vm.bookingColors,
    });
    this.notifyVM();
  }

  private daysManagement(props: {
    period: Period;
    selectedDate: string;
    checkIn?: Date;
    checkOut?: Date;
    bookingColors?: BookingColorType;
    rangeDates?: Required<Period>[];
    days: DayType[];
    startDateDay: DayType;
  }) {
    return props.days.map((dayOfmonth) => {
      if (dayOfmonth.day === props.startDateDay.day) {
        dayOfmonth = createDay({
          day: dateHandler({
            date: dayOfmonth.day,
            timezone: this.timezone,
          }),
          ...props,
        });
      }

      if (Object.keys(dayOfmonth).length !== 0) {
        dayOfmonth = createDay({
          day: dateHandler({
            date: dayOfmonth.day,
            timezone: this.timezone,
          }),
          ...props,
        });
      }

      if (
        props.period &&
        props.period.startDate &&
        props.period.endDate &&
        checkBetweenDates(
          props.period.startDate,
          props.period.endDate,
          dayOfmonth.day
        )
      ) {
        dayOfmonth = createDay({
          day: dateHandler({
            date: dayOfmonth.day,
            timezone: this.timezone,
          }),
          ...props,
        });
      }
      return { ...dayOfmonth };
    });
  }

  private displaySelectedDate(props: {
    period: Period;
    selectedDate: string;
    checkIn?: Date;
    checkOut?: Date;
    bookingColors?: BookingColorType;
    rangeDates?: Required<Period>[];
  }) {
    const selectedDateMonthKey = new Date(props.selectedDate).getMonth();
    const selectedDateYearKey = new Date(props.selectedDate).getFullYear();

    const startDateMonth = new Date(props.period.startDate || "").getMonth();
    const endDateMonth = new Date(props.period.endDate || "").getMonth();

    const monthId = `${selectedDateMonthKey}-${selectedDateYearKey}`;

    const selectedDateMonth = this.vm.months.find((el) => el.id === monthId);

    const startDateDay = {
      ...selectedDateMonth?.days.find((day) => day.day === props.selectedDate),
    };

    const copyMonths = this.vm.months.filter((month) => month.id !== monthId);

    const otherMonths = copyMonths.map((month) => {
      return {
        ...month,
        days: this.daysManagement({
          ...props,
          days: month.days,
          startDateDay,
        }),
      };
    });

    const otherMonthsChoose =
      startDateMonth !== endDateMonth ? otherMonths : copyMonths;

    this.vm.months = [
      ...otherMonthsChoose,
      {
        ...selectedDateMonth,
        days: this.daysManagement({
          ...props,
          days: selectedDateMonth?.days as DayType[],
          startDateDay,
        }),
      },
    ].sort((a, b) => Number(a.index) - Number(b.index));

    this.notifyVM();
  }

  displayCalendar({
    period,
    checkIn,
    checkOut,
    visualMonth,
    bookingColors,
  }: {
    period?: Period;
    checkIn?: Date;
    checkOut?: Date;
    visualMonth?: number;
    bookingColors?: BookingColorType;
  }) {
    if (visualMonth) {
      this.vm.visualMonth = visualMonth;
    }

    if (bookingColors) {
      this.vm.bookingColors = bookingColors;
    }

    this.generateMonths({ period, checkIn, checkOut, bookingColors });
  }
}
