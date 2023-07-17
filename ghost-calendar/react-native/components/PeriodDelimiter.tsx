import { memo } from "react";
import { View, Image } from "react-native";

import { BookingColorType, DayType } from "../../core";

import { style, getTypeColor } from "./style";
import { HalfDaySeparator } from "./HalfDaySeparator";

export const CheckIn = memo(
  ({
    day,
    editMode,
    bookingColors,
    periodColor,
  }: {
    day: DayType;
    editMode?: boolean;
    bookingColors?: BookingColorType;
    periodColor?: boolean;
  }) => {
    if (day.bookingType) {
      return (
        <>
          {day.bookingType === "option" && !editMode && !periodColor && (
            <Image source={require("./optionLeft.png")} style={style.ach2} />
          )}
          {!editMode && (
            <View
              style={getTypeColor(
                day.bookingType,
                true,
                false,
                bookingColors,
                periodColor
              )}
            />
          )}
        </>
      );
    }

    return (
      <View
        style={getTypeColor("owner", true, false, bookingColors, periodColor)}
      />
    );
  }
);

export const CheckOut = memo(
  ({
    day,
    editMode,
    bookingColors,
    periodColor,
  }: {
    day: DayType;
    editMode?: boolean;
    bookingColors?: BookingColorType;
    periodColor?: boolean;
  }) => {
    if (day.bookingType) {
      return (
        <>
          {day.bookingType === "option" && !editMode && !periodColor && (
            <Image source={require("./optionRight.png")} style={style.ach2} />
          )}
          {!editMode && (
            <View
              style={getTypeColor(
                day.bookingType,
                false,
                true,
                bookingColors,
                periodColor
              )}
            />
          )}
        </>
      );
    }

    return (
      <View
        style={getTypeColor("owner", false, true, bookingColors, periodColor)}
      />
    );
  }
);

export const CheckInCheckOut = ({
  tomorrow,
  yesterday,
  editMode,
  bookingColors,
  periodColor,
  daysSelected,
}: {
  yesterday: DayType;
  tomorrow: DayType;
  editMode?: boolean;
  bookingColors?: BookingColorType;
  periodColor?: boolean;
  daysSelected: DayType[];
}) => {
  const dayNumber = Number(tomorrow.dayNumber) - 1;
  const findDay = daysSelected.find((el) => Number(el.dayNumber) === dayNumber);

  if (yesterday.bookingType && tomorrow.bookingType) {
    if (
      findDay &&
      dayNumber === Number(yesterday.dayNumber) + 1 &&
      tomorrow.isStartDate
    ) {
      return (
        <>
          <View
            style={getTypeColor(
              yesterday.bookingType,
              false,
              true,
              bookingColors,
              periodColor
            )}
          />
          <View
            style={getTypeColor(
              "owner",
              true,
              false,
              bookingColors,
              periodColor
            )}
          />
        </>
      );
    } else if (
      findDay &&
      dayNumber === Number(yesterday.dayNumber) + 1 &&
      !tomorrow.isStartDate
    ) {
      return (
        <>
          <View
            style={getTypeColor(
              "owner",
              false,
              true,
              bookingColors,
              periodColor
            )}
          />
          <View
            style={getTypeColor(
              tomorrow.bookingType,
              true,
              false,
              bookingColors,
              periodColor
            )}
          />
        </>
      );
    }

    return !editMode ? (
      <>
        {yesterday.bookingType === "option" && !periodColor && (
          <Image source={require("./optionRight.png")} style={style.ach2} />
        )}
        {tomorrow.bookingType === "option" && !periodColor && (
          <Image source={require("./optionLeft.png")} style={style.ach2} />
        )}
        <HalfDaySeparator />
        <View
          style={getTypeColor(
            yesterday.bookingType,
            false,
            true,
            bookingColors,
            periodColor
          )}
        />
        <View
          style={getTypeColor(
            tomorrow.bookingType,
            true,
            false,
            bookingColors,
            periodColor
          )}
        />
      </>
    ) : null;
  }

  if (!yesterday.bookingType && tomorrow.bookingType) {
    return (
      <>
        {tomorrow.bookingType === "option" && !editMode && !periodColor && (
          <Image source={require("./optionLeft.png")} style={style.ach2} />
        )}
        <HalfDaySeparator />
        {!editMode && (
          <View
            style={getTypeColor(
              tomorrow.bookingType,
              true,
              false,
              bookingColors,
              periodColor
            )}
          />
        )}
        <View
          style={getTypeColor("owner", false, true, bookingColors, periodColor)}
        />
      </>
    );
  }

  if (yesterday.bookingType && !tomorrow.bookingType) {
    return (
      <>
        {yesterday.bookingType === "option" && !editMode && !periodColor && (
          <Image source={require("./optionRight.png")} style={style.ach2} />
        )}
        <HalfDaySeparator />
        {!editMode && (
          <View
            style={getTypeColor(
              yesterday.bookingType,
              false,
              true,
              bookingColors,
              periodColor
            )}
          />
        )}
        <View
          style={getTypeColor("owner", true, false, bookingColors, periodColor)}
        />
      </>
    );
  }

  return null;
};
