import { PeriodRules } from "../../../core";

export const getNextPeriod = (
  date: string,
  periodRules: PeriodRules[] | undefined,
  defaultMinimumDuration: number | undefined
): PeriodRules | undefined => {
  if (periodRules) {
    const matchingStartAtRule = periodRules.find(
      (rule) => rule.startAt === date
    );

    if (matchingStartAtRule) {
      return matchingStartAtRule;
    }

    const matchingEndAtRule = periodRules.find((rule) => rule.endAt === date);

    if (matchingEndAtRule) {
      return periodRules.find(
        (rule) => rule.startAt === matchingEndAtRule.startAt
      );
    }

    const matchingRule = periodRules.find((rule) => {
      const startDate = new Date(rule.startAt);
      const endDate = new Date(rule.endAt);
      const targetDate = new Date(date);

      return startDate <= targetDate && endDate >= targetDate;
    });

    if (matchingRule) return matchingRule;

    return {
      startAt: "",
      endAt: "",
      periodType: "nightly",
      minimumDuration: defaultMinimumDuration || 1,
    };
  }

  return undefined;
};
