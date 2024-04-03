import { PeriodType, WEEKLY_DAYS_NUMBER } from "./helpers/periodRules";
import { dateHandler, dayFormatter } from "./helpers/date";
import {
  BookingColorType,
  BookingInfo,
  ContractInfo,
  DayType,
  OwnerInfo,
  Period,
  PeriodRules,
} from "./helpers/types";
import {
  DateType,
  checkBetweenDates,
  checkCurrentDayAndPastDay,
} from "./helpers/utils";

export default class Range {
  private dayRange: DayType = {};

  constructor(private currentDay: DateType) {
    this.dayRange.day = dayFormatter(this.currentDay, "YYYY-MM-DD");
  }

  getDayNumber() {
    this.dayRange.dayNumber = dayFormatter(this.currentDay, "D");

    return this;
  }

  private isBooking(day: Required<Period>) {
    if (day.startDate === this.dayRange.day) {
      this.dayRange.isStartDate = true;
      this.dayRange.isBooking = true;
    }

    if (checkBetweenDates(day.startDate, day.endDate, this.dayRange.day))
      this.dayRange.isBooking = true;

    if (day.endDate === this.dayRange.day) {
      this.dayRange.isEndDate = true;
      this.dayRange.isBooking = true;
    }
  }

  private setBookingType(
    day: Required<Period>,
    bookingColors?: BookingColorType
  ) {
    if (day.startDate === this.dayRange.day) {
      this.dayRange.bookingType = day.type;

      if (
        bookingColors &&
        bookingColors[day.type] &&
        bookingColors[day.type]?.startEnd
      )
        this.dayRange.bookingColor = bookingColors[day.type]?.startEnd;
    }

    if (checkBetweenDates(day.startDate, day.endDate, this.dayRange.day)) {
      this.dayRange.bookingType = day.type;

      if (
        bookingColors &&
        bookingColors[day.type] &&
        bookingColors[day.type]?.beetween
      )
        this.dayRange.bookingColor = bookingColors[day.type]?.beetween;
    }

    if (day.endDate === this.dayRange.day) {
      this.dayRange.bookingType = day.type;

      if (
        bookingColors &&
        bookingColors[day.type] &&
        bookingColors[day.type]?.startEnd
      )
        this.dayRange.bookingColor = bookingColors[day.type]?.startEnd;
    }
  }

  private setCheckInOutTimes(day: Required<Period>) {
    const conditionOk =
      day.startDate === this.dayRange.day ||
      checkBetweenDates(day.startDate, day.endDate, this.dayRange.day) ||
      day.endDate === this.dayRange.day;

    if (conditionOk) {
      this.dayRange.checkInTime = day.checkInTime;
      this.dayRange.checkOutTime = day.checkOutTime;
    }
  }

  private setPeriod(day: Required<Period>) {
    const conditionOk =
      day.startDate === this.dayRange.day ||
      checkBetweenDates(day.startDate, day.endDate, this.dayRange.day) ||
      day.endDate === this.dayRange.day;

    if (conditionOk)
      this.dayRange.period = { checkIn: day.startDate, checkOut: day.endDate };
  }

  private setBookingId(day: Required<Period>) {
    const conditionOk =
      day.startDate === this.dayRange.day ||
      checkBetweenDates(day.startDate, day.endDate, this.dayRange.day) ||
      day.endDate === this.dayRange.day;

    if (conditionOk) this.dayRange.id = day.id;
  }

  private setOtherType(day: Required<Period>) {
    const conditionOk =
      day.startDate === this.dayRange.day ||
      checkBetweenDates(day.startDate, day.endDate, this.dayRange.day) ||
      day.endDate === this.dayRange.day;

    if (conditionOk) this.dayRange.otherType = day.otherType;
  }

  private setBookingContractInfo(day: BookingInfo) {
    if (day.type === "contract") {
      const { startDate, endDate } = day;
      const conditionOk =
        startDate === this.dayRange.day ||
        checkBetweenDates(startDate, endDate, this.dayRange.day) ||
        endDate === this.dayRange.day;

      if (conditionOk) this.setContractInfo(day);
    }

    return this;
  }

  private setContractInfo(day: Required<Period> & ContractInfo & OwnerInfo) {
    this.dayRange.clientFirstname = day.clientFirstname;
    this.dayRange.clientLastname = day.clientLastname;
    this.dayRange.currencyTrigram = day.currencyTrigram;
    this.dayRange.ownerPrice = day.ownerPrice;
    this.dayRange.contractId = day.contractId;
    this.dayRange.ownerPrivateToken = day.ownerPrivateToken;
    this.dayRange.ownerUploadYousignFileToken = day.ownerUploadYousignFileToken;
    this.dayRange.isManualySignedContract = day.isManualySignedContract;
    this.dayRange.statusDisplayedToUser = day.statusDisplayedToUser;
  }

  private setBookingComment(day: BookingInfo) {
    if (day.type === "owner") {
      const { startDate, privateNote, endDate } = day;
      const conditionOk =
        startDate === this.dayRange.day ||
        checkBetweenDates(startDate, endDate, this.dayRange.day) ||
        endDate === this.dayRange.day;

      if (conditionOk) this.dayRange.privateNote = privateNote;
    }

    return this;
  }

  dayManagement({
    range,
    options,
  }: {
    range: Required<Period>[] | undefined;
    options: { bookingColors?: BookingColorType };
    checkRange?: boolean;
  }) {
    if (range) {
      range.forEach((day) => {
        this.isBooking(day);
        this.setBookingType(day, options.bookingColors);
        this.setCheckInOutTimes(day);
        this.setPeriod(day);
        this.setBookingId(day);
        this.setOtherType(day);
        this.setBookingContractInfo(day);
        this.setBookingComment(day);
      });
    }

    return this;
  }

  isPast(date: DateType) {
    if (
      this.dayRange.day &&
      checkCurrentDayAndPastDay(this.dayRange.day, date)
    ) {
      this.dayRange.isPastDay = true;
    }

    return this;
  }

  setPeriodRules(periodRules: PeriodRules[] | undefined) {
    if (periodRules && periodRules.length > 0) {
      periodRules.forEach((rule) => {
        const isStartAt = rule.startAt === this.dayRange.day;
        const isBetween = checkBetweenDates(
          rule.startAt,
          rule.endAt,
          this.dayRange.day
        );
        const isEndAt = rule.endAt === this.dayRange.day;

        if ((!this.dayRange.periodType && isStartAt) || isBetween || isEndAt) {
          this.dayRange.minimunDuration = rule.minimumDuration;
          this.dayRange.periodType = rule.periodType;
          this.dayRange.periodRange = {
            startDate: rule.startAt,
            endDate: rule.endAt,
          };
        }

        if (isStartAt) {
          this.dayRange.startPeriod = true;
          this.dayRange.isInPeriod = true;
        }
        if (isEndAt) {
          this.dayRange.endPeriod = true;
          this.dayRange.isInPeriod = true;
        }
        if (isBetween) {
          if (
            this.dayRange.periodType?.includes("weekly") &&
            this.dayRange.minimunDuration
          ) {
            const diffDay = dateHandler({ date: this.dayRange.day }).diff(
              dateHandler({ date: rule.startAt }),
              "days"
            );
            const d = dateHandler({ date: this.dayRange.day }).get("day");
            const test =
              WEEKLY_DAYS_NUMBER[this.dayRange.periodType as PeriodType];
            if (d === test && diffDay % this.dayRange.minimunDuration === 0) {
              this.dayRange.isInPeriod = true;
            }
          }

          if (this.dayRange.periodType === "nightly") {
            this.dayRange.isInPeriod = true;
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
    if (!this.dayRange.periodType && periodRules && periodRules.length > 0) {
      this.dayRange.periodType = "nightly";
      this.dayRange.minimunDuration = defaultMinimumDuration || 1;
      this.dayRange.isInPeriod = true;
    }
    return this;
  }

  build() {
    return { ...this.dayRange };
  }
}
