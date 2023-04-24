import { useState } from "react";
import { View, Button } from "react-native";
import {
  CalendarComponent,
  rangeDates,
  RangeType,
} from "./react-native/components";

const fullYear = new Date().getFullYear();
const month = new Date().getMonth();

const startDateCalendar = new Date(fullYear, month, 1);
const endDateCalendar = new Date(fullYear + 1, month + 2, 1);

export default function App() {
  const [showRange, setShowRange] = useState<RangeType | null>(null);

  return (
    <View>
      <CalendarComponent
        withInteraction
        bookingDayHandler={(booking) => {
          console.log("booking", booking);
        }}
        rangeMarkerHandler={(range) => {
          console.log("range", range);
          if (range) setShowRange(range);
        }}
        locale="fr"
        startDate={startDateCalendar}
        endDate={endDateCalendar}
        visualMonth={24}
        rangeDates={rangeDates}
        hasCompletedRange={(hasCompletedRange) =>
          console.log("hasCompletedRange", hasCompletedRange)
        }
        timezone="Europe/Paris"
      />
      {showRange && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: 50,
            backgroundColor: "#fff",
            bottom: 0,
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
