import { StyleSheet, StyleProp, ViewStyle } from "react-native";

import { BookingColorType, DayType } from "../../core";

export const getCurrentDayColor = (day: DayType, isPeriodMode: boolean) => {
  const isStartOrEndAndNotPast =
    (day.isStartDate || day.isEndDate) && !day.isPastDay;

  if (day.isCurrentDay || isStartOrEndAndNotPast) {
    return { fontWeight: "bold" };
  }

  const isPeriod = isPeriodMode
    ? !day.isInPeriod || (!day.isInPeriod && day.isCurrentDay)
    : false;

  const hasContract =
    isPeriodMode && day.bookingType === "contract" ? true : false;

  if (day.isPastDay || isPeriod || hasContract) {
    return { color: "#aaaaaa" };
  }

  return {};
};

const selectStyleManager = (
  day: DayType,
  bookingColors?: BookingColorType,
  periodColor?: boolean
) => {
  if (day.isRangeDate) {
    return {
      ...style.ownerDayBooking,
      borderColor:
        bookingColors?.owner?.beetween || style.ownerDayBooking.borderColor,
      backgroundColor:
        bookingColors?.owner?.beetween || style.ownerDayBooking.backgroundColor,
    };
  }

  if (periodColor && day.isPastDay) {
    return style.periodDayBooking;
  }

  if (day.bookingType && !day.isStartDate && !day.isEndDate) {
    return periodColor
      ? style.periodDayBooking
      : style[`${day.bookingType}DayBooking`];
  }

  return style.day;
};

export const styleSelector = (
  day: DayType,
  editMode?: boolean,
  bookingColors?: BookingColorType,
  periodColor?: boolean
) => {
  if (day.isPastDay) {
    return selectStyleManager(day, bookingColors, periodColor);
  }

  if (Object.keys(day).length === 0) {
    return style.day;
  }

  if (day.isCurrentDay && !day.isBooking) {
    return style.dayCurrent;
  }

  if (editMode && !day.isBooking) {
    return selectStyleManager(day, bookingColors, periodColor);
  }

  return editMode
    ? style.day
    : selectStyleManager(day, bookingColors, periodColor);
};

const WIDTH = 50;

const communStyle: any = {
  width: "13%",
  height: WIDTH,
  flexDirection: "row",
  justifyContent: "center",
  fontSize: 16,
  paddingTop: "4.5%",
  margin: 1,
  color: "#202020",
};

export const getTypeColor = (
  type: "other" | "contract" | "option" | "owner",
  noLeftColor?: boolean,
  noRightColor?: boolean,
  bookingColors?: BookingColorType,
  periodColor?: boolean
): StyleProp<ViewStyle> => {
  const periodTheme = { start: "#F7F7F7", end: "#F7F7F7" };
  const theme = {
    other: periodColor ? periodTheme : { start: "#D9E8B0", end: "#D9E8B0" },
    contract: periodColor ? periodTheme : { start: "#E2D1B5", end: "#E9DDC8" },
    option: periodColor
      ? periodTheme
      : { start: "transparent", end: "transparent" },
    owner: {
      start: bookingColors?.owner?.startEnd || "#B8DED7",
      end: bookingColors?.owner?.startEnd || "#B8DED7",
    },
  };

  const MARGIN = 0;

  if (theme[type]) {
    return {
      position: "absolute",
      zIndex: 2,
      top: MARGIN,
      left: MARGIN,
      right: MARGIN,
      borderTopWidth: WIDTH,
      borderRightWidth: WIDTH - 3,
      borderRightColor: noRightColor ? "transparent" : theme[type].start,
      borderLeftColor: noLeftColor ? "transparent" : theme[type].end,
      borderBottomColor: noRightColor ? "transparent" : theme[type].start,
      borderTopColor: noLeftColor ? "transparent" : theme[type].end,
    };
  }

  return {};
};

export const style = StyleSheet.create({
  day: {
    ...communStyle,
  },
  ach: {
    width: "100%",
    height: WIDTH,
    position: "absolute",
    flexDirection: "row",
    top: 0,
    flexWrap: "wrap",
  },
  ach2: {
    width: "100%",
    height: WIDTH,
    position: "absolute",
    opacity: 0.5,
    zIndex: 3,
    flexDirection: "row",
    top: 0,
    flexWrap: "wrap",
  },
  dayCurrent: {
    ...communStyle,
    borderColor: "#decaaa",
  },
  otherDayBooking: {
    ...communStyle,
    borderColor: "#E9F1D1",
    backgroundColor: "#E9F1D1",
  },
  ownerDayBooking: {
    ...communStyle,
    borderColor: "#E3F2EF",
    backgroundColor: "#E3F2EF",
  },
  optionDayBooking: {
    ...communStyle,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  contractDayBooking: {
    ...communStyle,
    borderColor: "#F1E8DA",
    backgroundColor: "#F1E8DA",
  },
  periodDayBooking: {
    ...communStyle,
    borderColor: "#F7F7F7",
    backgroundColor: "#F7F7F7",
  },
});
