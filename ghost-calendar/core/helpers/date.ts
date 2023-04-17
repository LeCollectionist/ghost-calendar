import xdate from "xdate";

xdate.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const date = (date: any) => new xdate(date, true);

export const dayFormatter = (day: Date, format: string) => {
  return date(day).toString(format);
};

export const isDatePassed = (date: Date): boolean => {
  const currentDate = new Date(); // Date actuelle
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthToCheck = date.getMonth();
  const yearToCheck = date.getFullYear();
  return (
    yearToCheck < currentYear ||
    (yearToCheck === currentYear && monthToCheck < currentMonth)
  );
};
