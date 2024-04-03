import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";

import {
  CalendarComponent,
  periodRules,
  RangeType,
  rangeDates,
} from "./react-native/components";
import { createCalendar } from "./react-native/hooks/useCalendar";

const fullYear = new Date().getFullYear();
const month = new Date().getMonth();

const startDateCalendar = new Date(fullYear, month, 1);
const endDateCalendar = new Date(fullYear + 1, month + 2, 1);

const newCalendar = createCalendar({
  locale: "fr",
  startDate: startDateCalendar,
  endDate: endDateCalendar,
  rangeDates,
  visualMonth: 36,
  bookingColors: {},
  timezone: "Europe/Paris",
  periodRules: [],
  defaultMinimumDuration: 1,
});

function CalendarScreen() {
  const [showRange, setShowRange] = useState<RangeType | null>(null);

  useEffect(() => {
    newCalendar.calendar.build(newCalendar.presenter);
  }, []);

  return (
    <View>
      <CalendarComponent
        withInteraction
        locale="fr"
        rangeMarkerHandler={(range) => range && setShowRange(range)}
        newCalendar={newCalendar}
        bookingDayHandler={(day) => console.log("day", day)}
        periodIsValid={(isValid) => console.log(isValid)}
        periodRules={periodRules}
        defaultMinimumDuration={1}
      />
      {showRange && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: 50,
            bottom: 0,
            backgroundColor: "#00FF00",
          }}
        >
          <Button
            title="Reset Calendar"
            onPress={() => {
              showRange.resetCalendar();
              setShowRange(null);
            }}
          />
        </View>
      )}
    </View>
  );
}

export default function App() {
  return <CalendarScreen />;
}
