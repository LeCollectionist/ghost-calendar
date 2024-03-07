import React, { memo } from "react";
import { BookingColorType, DayType } from "../../core";
import {
  getNextDay,
  getPreviousDay,
  periodHasCompleted,
  periodHasNotEnDate,
  periodHasNotStartDate,
} from "./helper";
import { CheckIn, CheckInCheckOut, CheckOut } from "./PeriodDelimiter";

type CheckMarkerType = {
  day: DayType;
  days: DayType[];
  index: number;
  editMode?: boolean;
  bookingColors?: BookingColorType;
  periodColor?: boolean;
  daysSelected: DayType[];
};

export const CheckMarker = memo(
  ({
    day,
    days,
    index,
    editMode,
    bookingColors,
    periodColor,
    daysSelected,
  }: CheckMarkerType) => {
    if (periodHasNotEnDate(day)) {
      return (
        <CheckIn
          day={day}
          editMode={editMode}
          bookingColors={bookingColors}
          periodColor={periodColor}
        />
      );
    }

    if (periodHasNotStartDate(day)) {
      return (
        <CheckOut
          day={day}
          editMode={editMode}
          bookingColors={bookingColors}
          periodColor={periodColor}
        />
      );
    }

    if (periodHasCompleted(day)) {
      return (
        <CheckInCheckOut
          yesterday={getPreviousDay(days, index) || day}
          tomorrow={getNextDay(days, index) || day}
          editMode={editMode}
          bookingColors={bookingColors}
          periodColor={periodColor}
          daysSelected={daysSelected}
        />
      );
    }

    return null;
  }
);
