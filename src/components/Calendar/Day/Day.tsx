import React from "react";

interface DayProps {
  date: Date;
  year: number;
  month: number;
  selectedDay: Date;
  selectNewDay: (date: Date, key: string) => void;
  notes: Object | null;
}

const Day: React.FC<DayProps> = ({
  date,
  year,
  month,
  selectedDay,
  selectNewDay,
  notes,
}) => {
  const keyNote =
    date.getFullYear().toString() +
    date.getMonth().toString() +
    date.getDate().toString();

  const classes: string[] = ["day"];

  if (notes && notes.hasOwnProperty(keyNote)) {
    classes.push("settedNotes");
  }
  if (
    date.getFullYear() === selectedDay.getFullYear() &&
    date.getMonth() === selectedDay.getMonth() &&
    date.getDate() === selectedDay.getDate()
  ) {
    classes.push("selectedDate");
  }
  if (date.getFullYear() === year && date.getMonth() === month) {
    classes.push("activeDate");
  } else {
    classes.push("passiveDate");
  }

  return (
    <div
      className={classes.join(" ")}
      onClick={() => selectNewDay(date, keyNote)}
    >
      {date.getDate()}
    </div>
  );
};

export default Day;
