import dayjs from "dayjs";
import * as Haptics from "expo-haptics";
import { DayType } from "../../../core";
import { periodRulesValidator } from "../../../core/helpers/periodRules";
import { getBookingDateUi } from "../../../core/helpers/utils";
import { DayComponentType } from "../Days";

let daysT: DayType[] = [];
let daysD: DayType[] = [];

const ajouterElement = (nouvelElement: DayType): void => {
  if (daysT.length < 2) {
    daysT.push(nouvelElement);
  } else {
    daysT.splice(0, 2, nouvelElement);
  }
};

const ajouterElementD = (nouvelElement: DayType): void => {
  if (daysD.length < 2) {
    daysD.push(nouvelElement);
  } else {
    daysD.splice(0, 2, nouvelElement);
  }
};

export const onPressHandler = ({
  rangeMarkerHandler,
  bookingDayHandler,
  calendar,
  day,
  hasCompletedRange,
  resetCalendar,
  setPeriod,
  withInteraction,
  periodIsValid,
  setPeriodIsValid,
  setDaysSelected,
}: Omit<DayComponentType, "setNextDay"> & { day: DayType }) => {
  if (hasCompletedRange && day) {
    ajouterElement(day);
    hasCompletedRange(daysT.length === 2);
  }
  if (day.isBooking && bookingDayHandler) bookingDayHandler(day);

  if (withInteraction) {
    setPeriod(day);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  const condition =
    (day.isBooking && (day.isStartDate || day.isEndDate)) || !day.isBooking;
  if (rangeMarkerHandler && day && condition) {
    ajouterElementD(day);
    if (periodIsValid)
      periodManager({ periodIsValid, setPeriodIsValid, setDaysSelected });

    if (daysD.length === 2) {
      if (dayjs(daysD[1].day).diff(daysD[0].day) < 0 && daysD.length === 2)
        ajouterElementD(day);

      if (
        getBookingDateUi(calendar, daysD[0]?.day || "", daysD[1]?.day || "")
          .length > 0
      ) {
        ajouterElementD(day);
      }

      rangeMarkerHandler({
        startDate: daysD[0]?.day || "",
        endDate: daysD[1]?.day || "",
        resetCalendar: () => {
          setPeriodIsValid(true);
          resetCalendar();
        },
      });
    }
  }
};

const periodManager = ({
  periodIsValid,
  setPeriodIsValid,
  setDaysSelected,
}: {
  periodIsValid: DayComponentType["periodIsValid"];
  setPeriodIsValid: DayComponentType["setPeriodIsValid"];
  setDaysSelected: (day: DayType[]) => void;
}) => {
  const isValid = periodRulesValidator({
    startAt: {
      date: daysD[0]?.day || "",
      mininumDuration: daysD[0]?.minimunDuration || 1,
      dayRule: daysD[0]?.periodType || "nightly",
    },
    endAt: {
      date: daysD[1]?.day || "",
      mininumDuration: daysD[1]?.minimunDuration || 1,
      dayRule: daysD[1]?.periodType || "nightly",
    },
  });

  if (periodIsValid) {
    setDaysSelected(daysD);
    setPeriodIsValid(isValid);
    periodIsValid(isValid);
  }
};
