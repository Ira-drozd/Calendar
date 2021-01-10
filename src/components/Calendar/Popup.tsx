import React, { useState } from "react";

interface PopupProps {
  isOpen: Boolean;
  keyNote: string;
  addNewNote: (key: string, time: string, message: string) => void;
  removeNote: (key: string, time: string) => void;
  closePopup: () => void;
  selectNote?: { time: string; message: string } | null;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  keyNote,
  addNewNote,
  closePopup,
  selectNote = null,
  removeNote,
}) => {
  const timestamps: string[] = [...Array.from(Array(24).keys())].map(
    (time) => "00:" + (time < 10 ? "0" + time : time)
  );

  const [message, setMessage] = useState<string | "">(
    selectNote !== null ? selectNote.message : ""
  );
  const [time, setTime] = useState<string | "">(
    selectNote !== null ? selectNote.time : timestamps[0]
  );

  const handleChangeMessage = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };
  const handleChangeTime = (e: React.FormEvent<HTMLSelectElement>) => {
    setTime(e.currentTarget.value);
  };
  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewNote(keyNote, time, message);
    closePopup();
  };

  return isOpen ? (
    <div className="popupContainer">
      <div className="navbarForm">
        <div className="close" onClick={() => closePopup()}>
          &#215;
        </div>
        {selectNote && (
          <button
            disabled={selectNote === null}
            onClick={() => removeNote(keyNote, selectNote.time)}
          >
            Remove
          </button>
        )}
      </div>
      <form onSubmit={handleSubmitMessage}>
        <select value={time} onChange={handleChangeTime}>
          {timestamps.map((timestamp) => (
            <option key={timestamp} value={timestamp}>
              {timestamp}
            </option>
          ))}
        </select>
        <textarea
          rows={5}
          className="textarea"
          value={message}
          onChange={handleChangeMessage}
        />
        <input type="submit" value="Add" />
      </form>
    </div>
  ) : null;
};

export default Popup;
