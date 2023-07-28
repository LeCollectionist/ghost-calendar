import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { DateType } from "./utils";
import { LocaleType, WorldTimezones } from "./types";

require("dayjs/locale/fr");

dayjs.extend(utc);
dayjs.extend(timezone);

export const dateHandler = ({
  date,
  timezone: timezoneT = "Europe/Paris",
}: {
  date?: string | number | Date | DateType | null | undefined;
  timezone?: WorldTimezones;
  locale?: LocaleType;
}) => {
  dayjs.tz.setDefault(timezoneT);
  return dayjs(date);
};

export const dayFormatter = (day: Date | DateType, format: string) => {
  return dateHandler({ date: day }).format(format);
};

export const isDatePassed = (
  date: DateType,
  timezone?: WorldTimezones
): boolean => {
  const currentDate = dateHandler({ timezone }); // Date actuelle
  const currentMonth = currentDate.get("month");
  const currentYear = currentDate.get("year");
  const monthToCheck = date.get("month");
  const yearToCheck = date.get("year");
  return (
    yearToCheck < currentYear ||
    (yearToCheck === currentYear && monthToCheck < currentMonth)
  );
};
