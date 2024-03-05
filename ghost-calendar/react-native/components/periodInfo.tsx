import React from "react";
import { View, Text } from "react-native";
import { DayType, LocaleType, PeriodRules } from "../../core";
import { style as customStyle } from "./style";
import { DayRuleType, PeriodType } from "../../core/helpers/periodRules";

const PeriodTypeTrads = {
  fr: {
    weekly_by_sunday: "Du dimanche au dimanche.",
    weekly_by_monday: "Du lundi au lundi.",
    weekly_by_tuesday: "Du mardi au mardi.",
    weekly_by_wednesday: "Du mercredi au mercredi.",
    weekly_by_thursday: "Du jeudi au jeudi.",
    weekly_by_friday: "Du vendredi au vendredi.",
    weekly_by_saturday: "Du samedi au samedi.",
  },
  en: {
    weekly_by_sunday: "From Sunday to Sunday.",
    weekly_by_monday: "From Monday to Monday.",
    weekly_by_tuesday: "From Tuesday to Tuesday.",
    weekly_by_wednesday: "From Wednesday to Wednesday.",
    weekly_by_thursday: "From Thursday to Thursday.",
    weekly_by_friday: "From Friday to Friday.",
    weekly_by_saturday: "From Saturday to Saturday.",
  },
};

type Locale = "fr" | "en";

const getWeekPlurial = (nb: number, locale: Locale) => {
  if (nb > 1) return locale === "fr" ? "semaines minimum. " : "minimum weeks. ";

  return locale === "fr" ? "semaine minimum. " : "minimum week. ";
};

const getTypeOfPeriod = ({
  locale,
  periodType,
  minimunDuration,
}: {
  locale: Locale;
  periodType: DayRuleType;
  minimunDuration: number;
}) => {
  if (periodType === "nightly")
    return locale === "fr" ? "nuits minimum. " : "minimum nights. ";
  return getWeekPlurial(minimunDuration, locale);
};

const PeriodMessage = ({
  day,
  locale,
}: {
  day: PeriodRules;
  locale: LocaleType;
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      width: "100%",
      paddingHorizontal: 12,
      backgroundColor: "#F1E8DA",
    }}
  >
    <View style={[customStyle.day, { width: "100%" }]}>
      <Text>
        {day.minimumDuration || 1}{" "}
        {getTypeOfPeriod({
          locale: locale as Locale,
          periodType: day.periodType as DayRuleType,
          minimunDuration: day.minimumDuration || 1,
        })}
        {PeriodTypeTrads[locale as Locale][day.periodType as PeriodType]}
      </Text>
    </View>
  </View>
);

export const PeriodInfo = ({
  locale,
  daysSelected,
  nextDay,
}: {
  locale: LocaleType;
  daysSelected: DayType[];
  nextDay: PeriodRules | null;
}) => {
  if (nextDay) return <PeriodMessage day={nextDay} locale={locale} />;

  return null;
};
