import { CalendarPresenter, CalendarVM } from "../CalendarPresenter";
import { dateHandler } from "./date";
import { MonthType, WorldTimezones } from "./types";
import { checkCurrentDayAndPastDay } from "./utils";

export const notifyIfPeriodIsUncompleted = (
  presenter: CalendarPresenter,
  day: string,
  startDayState: string,
  calendarState: CalendarVM,
  initialMonths: MonthType[],
  timezone?: WorldTimezones
) => {
  if (
    checkCurrentDayAndPastDay(
      day,
      dateHandler({ date: startDayState, timezone })
    )
  ) {
    presenter.displayStartDate(day, initialMonths, calendarState);
  } else {
    presenter.displayEndDate(day, startDayState, calendarState, initialMonths);
  }
};
