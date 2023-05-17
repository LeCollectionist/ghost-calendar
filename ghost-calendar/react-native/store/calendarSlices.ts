import { createSlice } from "@reduxjs/toolkit";
import { createCalendar } from "../hooks/useCalendar";

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    calendar: null,
    calendarBuild: null,
    calendarPresenter: null,
  },
  reducers: {
    setCalendar(state, action) {
      state.calendar = action.payload;
    },
  },
});

export const { setCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
