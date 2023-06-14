import { createCalendar } from "../../react-native/hooks/useCalendar";

const fullYear = new Date("2022-06-05").getFullYear();
const month = new Date("2022-06-05").getMonth();

const startDateCalendar = new Date(fullYear, month, 1);
const endDateCalendar = new Date(fullYear + 1, month + 2, 1);

const { presenter, calendar } = createCalendar({
  locale: "fr",
  startDate: startDateCalendar,
  endDate: endDateCalendar,
  rangeDates: [
    {
      startDate: "2022-06-15",
      endDate: "2022-06-17",
      type: "other",
      checkInTime: 17,
      checkOutTime: 10,
      id: "3",
      otherType: "Bookings::Admin",
    },
    {
      startDate: "2022-06-25",
      endDate: "2022-06-30",
      type: "other",
      checkInTime: 17,
      checkOutTime: 10,
      id: "4",
      otherType: "Bookings::Admin",
    },
  ],
  visualMonth: 1,
  bookingColors: {},
  timezone: "Europe/Paris",
  periodRules: [],
});

const initialMonths = [...presenter.vm.months];
const calendarState = presenter.vm;

calendar.build(presenter);

describe("Calendar", () => {
  it("Should create new calendar", () => {
    //Then
    presenter.vm.months.map((month) => {
      expect(month.id).toBe("5-2022");
      expect(month.days.length).toBe(42);
      expect(month.index).toBe(0);
      expect(month.monthKey).toBe(5);
      expect(month.monthName).toBe("juin 2022");
    });
  });

  it("Should set a period", () => {
    //Given
    const startDate = { day: "2022-06-06" };
    const endDate = { day: "2022-06-10" };
    //When
    calendar.setPeriod(presenter, startDate, calendarState, initialMonths);
    calendar.setPeriod(presenter, endDate, calendarState, initialMonths);
    //Then
    presenter.vm.months.map((month) => {
      const findStartDay = month.days.find((day) => day.day === "2022-06-06");
      const findEndDay = month.days.find((day) => day.day === "2022-06-10");
      const findBetweenDay = month.days.find((day) => day.day === "2022-06-08");
      expect(findStartDay).toEqual({
        day: "2022-06-06",
        dayNumber: "6",
        isSelectedDate: true,
        isStartDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findEndDay).toEqual({
        day: "2022-06-10",
        dayNumber: "10",
        isSelectedDate: true,
        isEndDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findBetweenDay).toEqual({
        day: "2022-06-08",
        dayNumber: "8",
        isRangeDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
    });
  });

  it("Should clear period selection", () => {
    //Given
    const startDate = { day: "2022-06-06" };
    const endDate = { day: "2022-06-10" };
    //When
    calendar.setPeriod(presenter, startDate, calendarState, initialMonths);
    calendar.setPeriod(presenter, endDate, calendarState, initialMonths);
    calendar.clearCalendar(presenter, calendarState, initialMonths);
    //Then
    presenter.vm.months.map((month) => {
      const findStartDay = month.days.find((day) => day.day === "2022-06-06");
      const findEndDay = month.days.find((day) => day.day === "2022-06-10");
      const findBetweenDay = month.days.find((day) => day.day === "2022-06-08");
      expect(findStartDay).toEqual({
        day: "2022-06-06",
        isPastDay: true,
        dayNumber: "6",
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findEndDay).toEqual({
        day: "2022-06-10",
        dayNumber: "10",
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findBetweenDay).toEqual({
        day: "2022-06-08",
        dayNumber: "8",
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
    });
  });

  it("Should set a period with range dates", () => {
    //Given
    const startDate = { day: "2022-06-17" };
    const endDate = { day: "2022-06-19" };
    //When
    calendar.setPeriod(presenter, startDate, calendarState, initialMonths);
    calendar.setPeriod(presenter, endDate, calendarState, initialMonths);
    //Then
    presenter.vm.months.map((month) => {
      const findStartDay = month.days.find((day) => day.day === "2022-06-17");
      const findEndDay = month.days.find((day) => day.day === "2022-06-19");
      const findBetweenDay = month.days.find((day) => day.day === "2022-06-18");
      expect(findStartDay).toEqual({
        day: "2022-06-17",
        dayNumber: "17",
        isSelectedDate: true,
        isStartDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findEndDay).toEqual({
        day: "2022-06-19",
        dayNumber: "19",
        isSelectedDate: true,
        isEndDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findBetweenDay).toEqual({
        day: "2022-06-18",
        dayNumber: "18",
        isRangeDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
    });
  });

  it("Should set a period with range dates", () => {
    //Given
    const startDate = { day: "2022-06-20" };
    const endDate = { day: "2022-06-25" };
    //When
    calendar.setPeriod(presenter, startDate, calendarState, initialMonths);
    calendar.setPeriod(presenter, endDate, calendarState, initialMonths);
    //Then
    presenter.vm.months.map((month) => {
      const findStartDay = month.days.find((day) => day.day === "2022-06-20");
      const findEndDay = month.days.find((day) => day.day === "2022-06-25");
      const findBetweenDay = month.days.find((day) => day.day === "2022-06-22");
      expect(findStartDay).toEqual({
        day: "2022-06-20",
        dayNumber: "20",
        isSelectedDate: true,
        isPastDay: true,
        isStartDate: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findEndDay).toEqual({
        day: "2022-06-25",
        dayNumber: "25",
        isSelectedDate: true,
        isEndDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
      expect(findBetweenDay).toEqual({
        day: "2022-06-22",
        dayNumber: "22",
        isRangeDate: true,
        isPastDay: true,
        isInPeriod: true,
        minimunDuration: 1,
        periodType: "nightly",
      });
    });
  });
});
