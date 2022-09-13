import { Period } from "../../../core";

export const rangeDates: Required<Period>[] = [
  {
    startDate: "2022-05-01",
    endDate: "2022-05-07",
    type: "other",
    checkInTime: 17,
    checkOutTime: 10,
    id: "1",
    otherType: "Bookings::Admin",
  },
  {
    startDate: "2022-06-01",
    endDate: "2022-06-07",
    type: "owner",
    checkInTime: 17,
    checkOutTime: 10,
    id: "2",
    otherType: "Bookings::Owner",
  },
  {
    startDate: "2022-07-15",
    endDate: "2022-08-15",
    type: "other",
    checkInTime: 17,
    checkOutTime: 10,
    id: "3",
    otherType: "Bookings::Admin",
  },
  {
    startDate: "2022-09-15",
    endDate: "2022-09-18",
    type: "other",
    checkInTime: 17,
    checkOutTime: 10,
    id: "4",
    otherType: "Bookings::Admin",
  },
  {
    startDate: "2022-09-18",
    endDate: "2022-09-21",
    type: "option",
    checkInTime: 17,
    checkOutTime: 10,
    id: "5",
    otherType: "Bookings::SalesOption",
  },
  {
    startDate: "2022-12-18",
    endDate: "2022-12-21",
    type: "option",
    checkInTime: 17,
    checkOutTime: 10,
    id: "6",
    otherType: "Bookings::ClientOption",
  },
  {
    startDate: "2023-02-18",
    endDate: "2023-02-21",
    type: "other",
    checkInTime: 17,
    checkOutTime: 10,
    id: "7",
    otherType: "Bookings::Admin",
  },
  {
    startDate: "2023-01-18",
    endDate: "2023-01-21",
    type: "contract",
    checkInTime: 17,
    checkOutTime: 10,
    id: "8",
    otherType: "Bookings::Contract",
  },
];
