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
  }: {
    day: DayType;
    editMode?: boolean;
    bookingColors?: BookingColorType;
  }) => {
    if (day.bookingType) {
      return (
        <>
          {day.bookingType === "option" && !editMode && (
            <Image source={require("./optionLeft.png")} style={style.ach2} />
          )}
          {!editMode && (
            <View
              style={getTypeColor(day.bookingType, true, false, bookingColors)}
            />
          )}
        </>
      );
    }

    return <View style={getTypeColor("owner", true, false, bookingColors)} />;
  }
);

export const CheckOut = memo(
  ({
    day,
    editMode,
    bookingColors,
  }: {
    day: DayType;
    editMode?: boolean;
    bookingColors?: BookingColorType;
  }) => {
    if (day.bookingType) {
      return (
        <>
          {day.bookingType === "option" && !editMode && (
            <Image source={require("./optionRight.png")} style={style.ach2} />
          )}
          {!editMode && (
            <View
              style={getTypeColor(day.bookingType, false, true, bookingColors)}
            />
          )}
        </>
      );
    }

    return <View style={getTypeColor("owner", false, true, bookingColors)} />;
  }
);

export const CheckInCheckOut = ({
  tomorrow,
  yesterday,
  editMode,
  bookingColors,
}: {
  yesterday: DayType;
  tomorrow: DayType;
  editMode?: boolean;
  bookingColors?: BookingColorType;
}) => {
  if (yesterday.bookingType && tomorrow.bookingType) {
    return !editMode ? (
      <>
        {yesterday.bookingType === "option" && (
          <Image source={require("./optionRight.png")} style={style.ach2} />
        )}
        {tomorrow.bookingType === "option" && (
          <Image source={require("./optionLeft.png")} style={style.ach2} />
        )}
        <HalfDaySeparator />
        <View
          style={getTypeColor(
            yesterday.bookingType,
            false,
            true,
            bookingColors
          )}
        />
        <View
          style={getTypeColor(tomorrow.bookingType, true, false, bookingColors)}
        />
      </>
    ) : null;
  }

  if (!yesterday.bookingType && tomorrow.bookingType) {
    return (
      <>
        {tomorrow.bookingType === "option" && !editMode && (
          <Image source={require("./optionLeft.png")} style={style.ach2} />
        )}
        <HalfDaySeparator />
        {!editMode && (
          <View
            style={getTypeColor(
              tomorrow.bookingType,
              true,
              false,
              bookingColors
            )}
          />
        )}
        <View style={getTypeColor("owner", false, true, bookingColors)} />
      </>
    );
  }

  if (yesterday.bookingType && !tomorrow.bookingType) {
    return (
      <>
        {yesterday.bookingType === "option" && !editMode && (
          <Image source={require("./optionRight.png")} style={style.ach2} />
        )}
        <HalfDaySeparator />
        {!editMode && (
          <View
            style={getTypeColor(
              yesterday.bookingType,
              false,
              true,
              bookingColors
            )}
          />
        )}
        <View style={getTypeColor("owner", true, false, bookingColors)} />
      </>
    );
  }

  return null;
};
