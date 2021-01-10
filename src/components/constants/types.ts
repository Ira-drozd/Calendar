export interface DataProps {
  year: number;
  month: number;
  calendar: Date[] | null;
}

export interface NoteItem {
  [key: string]: string;
}
export interface NotesProps {
  [key: string]: NoteItem;
}
