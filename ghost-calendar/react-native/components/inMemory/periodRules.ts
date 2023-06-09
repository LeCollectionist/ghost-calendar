import { PeriodRules } from "../../../core";

export const periodRules: PeriodRules[] = [
  {
    startAt: "2023-06-13",
    endAt: "2023-06-20",
    periodType: "weekly_by_tuesday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-06-21",
    endAt: "2023-06-27",
    periodType: "nightly",
    minimumDuration: 3,
  },
  {
    startAt: "2023-07-06",
    endAt: "2023-07-20",
    periodType: "weekly_by_thursday",
    minimumDuration: 2,
  },
  {
    startAt: "2023-07-24",
    endAt: "2023-07-31",
    periodType: "weekly_by_monday",
    minimumDuration: 2,
  },
];
