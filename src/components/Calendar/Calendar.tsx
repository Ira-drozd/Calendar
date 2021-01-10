import React, { useMemo, useState } from "react";
import { DataProps, NoteItem, NotesProps } from "../constants/types";
import Day from "./Day/Day";
import Notebook from "./Notebook/Notebook";
import Popup from "./Popup";

const Calendar: React.FC = () => {
  const today: Date = new Date();
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    selectedKey: string;
  }>({
    date: today,
    selectedKey:
      today.getFullYear().toString() +
      today.getMonth().toString() +
      today.getDate().toString(),
  });
  const [notes, setNotes] = useState<NotesProps | null>(null);
  const [isPopup, setIsPopup] = useState<Boolean>(false);
  const [editTime, setEditTime] = useState<{
    time: string;
    message: string;
  } | null>(null);
  const monthName: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [yearsName, setYearsName] = useState<number[]>([
    today.getFullYear() - 2,
    today.getFullYear() - 1,
    today.getFullYear(),
    today.getFullYear() + 1,
    today.getFullYear() + 2,
  ]);

  const closePopup = () => {
    setIsPopup(false);
    setEditTime(null);
  };

  const getLastDay = (month: number, year: number) => {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
  };

  const getDayOfWeek = (selectedDay: Date) => {
    const date = selectedDay;
    return date.getDay();
  };

  const setCalendar = (
    month: number,
    year: number,
    firstDayOfWeek: number,
    lastDatePrevMonth: Date,
    firstDateNextMonth: Date
  ) => {
    const calendarSize = 42;
    const calendar: Date[] = [
      ...Array.from(Array(getLastDay(month, year)).keys()),
    ].map((day) => new Date(year, month, day + 1));

    if (firstDayOfWeek > 1 || firstDayOfWeek === 0) {
      let mondayDate =
        firstDayOfWeek === 0
          ? lastDatePrevMonth.getDate() - 5
          : lastDatePrevMonth.getDate() - firstDayOfWeek + 2;

      const prevDays: Date[] = [
        ...Array.from(
          Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).keys()
        ),
      ].map(
        () =>
          new Date(
            lastDatePrevMonth.getFullYear(),
            lastDatePrevMonth.getMonth(),
            mondayDate++
          )
      );
      calendar.unshift(...prevDays);
    }

    if (calendarSize - calendar.length !== 0) {
      const countDays = 42 - calendar.length;
      const nextDays: Date[] = [...Array.from(Array(countDays).keys())].map(
        (day) =>
          new Date(
            firstDateNextMonth.getFullYear(),
            firstDateNextMonth.getMonth(),
            day + 1
          )
      );
      calendar.push(...nextDays);
    }

    return calendar;
  };

  const [dataCalendar, setDataCalendar] = useState<DataProps>({
    year: today.getFullYear(),
    month: today.getMonth(),
    calendar: setCalendar(
      today.getMonth(),
      today.getFullYear(),
      getDayOfWeek(new Date(today.getFullYear(), today.getMonth(), 1)),
      new Date(today.getFullYear(), today.getMonth(), 0),
      new Date(today.getFullYear(), today.getMonth() + 1, 1)
    ),
  });

  useMemo(() => {
    const years = [
      dataCalendar.year - 2,
      dataCalendar.year - 1,
      dataCalendar.year,
      dataCalendar.year + 1,
      dataCalendar.year + 2,
    ];
    setYearsName(years);
  }, [dataCalendar.year]);

  const switchMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    setDataCalendar({
      year: year,
      month: month,
      calendar: setCalendar(
        month,
        year,
        getDayOfWeek(new Date(year, month, 1)),
        new Date(year, month, 0),
        new Date(year, month + 1, 1)
      ),
    });
  };

  const selectNewDay = (date: Date, selectedKey: string) => {
    setSelectedDay({ date, selectedKey });
  };

  const addNewNote = (key: string, time: string, message: string) => {
    const note: NoteItem = { [time]: message };
    let day: NotesProps | null;
    const allNotes = { ...notes };
    if (allNotes !== null && allNotes.hasOwnProperty(key)) {
      day = { [key]: Object.assign({ ...allNotes[key] }, note) };
    } else {
      day = { [key]: note };
    }
    setNotes((prevState) => Object.assign(prevState || {}, day));
    closePopup();
  };

  const removeNote = (key: string, time: string) => {
    const allNotes = { ...notes };
    const note: NoteItem = allNotes[key];
    delete note[time];
    if (Object.keys(note).length === 0) {
      delete allNotes[key];
    } else {
      const day = { [key]: note };
      Object.assign(allNotes, day);
    }
    setNotes(allNotes);
    closePopup();
  };

  const setEditMode = (time: string, message: string) => {
    setEditTime({ time, message });
    setIsPopup(true);
  };

  return (
    <div className="calendarContainer">
      {isPopup ? (
        <Popup
          isOpen={isPopup}
          closePopup={closePopup}
          keyNote={selectedDay.selectedKey}
          addNewNote={addNewNote}
          removeNote={removeNote}
          selectNote={editTime}
        />
      ) : (
        dataCalendar.calendar !== null &&
        dataCalendar.month !== null &&
        dataCalendar.year !== null && (
          <div className="content">
            <div className="calendar">
              <div className="navbar">
                <div
                  onClick={() =>
                    switchMonth(
                      new Date(dataCalendar.year, dataCalendar.month, 0)
                    )
                  }
                  className="arrow prev"
                >
                  &#10094;
                </div>
                <div className="date">
                  <select
                    className="selectDate"
                    value={dataCalendar.month}
                    onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                      switchMonth(
                        new Date(dataCalendar.year, +e.currentTarget.value, 1)
                      );
                    }}
                  >
                    {monthName.map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="selectDate"
                    value={dataCalendar.year}
                    onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                      switchMonth(
                        new Date(+e.currentTarget.value, dataCalendar.month, 1)
                      );
                    }}
                  >
                    {yearsName.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  onClick={() =>
                    switchMonth(
                      new Date(dataCalendar.year, dataCalendar.month + 1, 1)
                    )
                  }
                  className="arrow next"
                >
                  &#10095;
                </div>
              </div>
              <div className="daysName">
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
                <div>Su</div>
              </div>
              <div className="days">
                {dataCalendar.calendar.map((date: Date, index) => (
                  <Day
                    key={date.toString()}
                    date={date}
                    month={dataCalendar.month}
                    year={dataCalendar.year}
                    selectedDay={selectedDay.date}
                    selectNewDay={selectNewDay}
                    notes={notes}
                  />
                ))}
              </div>
              <div onClick={() => setIsPopup(true)} className="selectedDate">
                <div>
                  {selectedDay.date.getDate()}{" "}
                  {monthName[selectedDay.date.getMonth()]}{" "}
                  {selectedDay.date.getFullYear()}
                </div>
                <div>Add +</div>
              </div>
            </div>
            <Notebook
              selectedDay={selectedDay}
              notes={notes}
              removeNote={removeNote}
              setEditMode={setEditMode}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Calendar;
