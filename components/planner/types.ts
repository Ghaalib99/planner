export interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

export interface Event {
  id: string;
  department: string;
  title: string;
  startTime: string;
  endTime: string;
  staff: string;
  color: "orange" | "green" | "yellow" | "blue" | "purple";
  column: number;
  columnSpan?: number;
  subColumn?: number;
  subColumnSpan?: number;
}

export interface CalendarViewProps {
  events?: Event[];
  departments?: string[];
  startHour?: number;
  endHour?: number;
  slotInterval?: 30 | 60;
}
