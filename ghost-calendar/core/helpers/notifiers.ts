import { CalendarPresenter } from "../CalendarPresenter";
import { WorldTimezones } from "./types";
import { checkCurrentDayAndPastDay } from "./utils";

export const notifyIfPeriodIsUncompleted = (
  presenter: CalendarPresenter,
  day: string,
  startDayState: string,
  timezone?: WorldTimezones
) => {
  if (checkCurrentDayAndPastDay(day, new Date(startDayState), timezone)) {
    presenter.displayStartDate(day);
  } else {
    presenter.displayEndDate(day, startDayState);
  }
};
