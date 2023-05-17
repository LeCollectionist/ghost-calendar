import { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  CalendarComponent,
  rangeDates,
  RangeType,
} from "./react-native/components";
import { AppDispatch, RootState, store } from "./react-native/store";
import { setCalendar } from "./react-native/store/calendarSlices";
import { CalendarVM } from "./core";
import { createCalendar } from "./react-native/hooks/useCalendar";

const fullYear = new Date().getFullYear();
const month = new Date().getMonth();

const startDateCalendar = new Date(fullYear, month, 1);
const endDateCalendar = new Date(fullYear + 1, month + 2, 1);

function HomeScreen() {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}

function CalendarScreen() {
  const [showRange, setShowRange] = useState<RangeType | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { calendar } = useSelector((state: RootState) => state.calendar);

  const setCalendarStore = (vm: CalendarVM) => dispatch(setCalendar(vm));

  const { calendar: calendarBuild, presenter } = createCalendar({
    locale: "fr",
    startDate: startDateCalendar,
    endDate: endDateCalendar,
    rangeDates,
    visualMonth: 24,
    bookingColors: {},
    timezone: "Europe/Paris",
  });

  useEffect(() => {
    calendarBuild.build(presenter);
  }, []);

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
        setCalendarStore={setCalendarStore}
        calendarStore={calendar}
        calendarBuild={calendarBuild}
        calendarPresenter={presenter}
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

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
