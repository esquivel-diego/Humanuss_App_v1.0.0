import { create } from "zustand";

export interface AttendanceRecord {
  day: string; // "Lunes", "Martes", etc.
  checkIn?: string;
  checkOut?: string;
}

interface AttendanceStore {
  records: Record<number, AttendanceRecord[]>;
  markCheckIn: (userId: number, day: string, time: string) => void;
  markCheckOut: (userId: number, day: string, time: string) => void;
  getWeek: (userId: number) => AttendanceRecord[];
}

const STORAGE_KEY = "attendanceStore";

const loadFromStorage = (): Record<number, AttendanceRecord[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveToStorage = (records: Record<number, AttendanceRecord[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // no-op
  }
};

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  records: loadFromStorage(),

  markCheckIn: (userId, day, time) => {
    const current = get().records[userId] || [];
    const updated = current.map((d) =>
      d.day === day ? { ...d, checkIn: time } : d
    );

    const exists = current.some((d) => d.day === day);
    const newWeek = exists ? updated : [...current, { day, checkIn: time }];

    const newRecords = {
      ...get().records,
      [userId]: newWeek,
    };

    set({ records: newRecords });
    saveToStorage(newRecords);
  },

  markCheckOut: (userId, day, time) => {
    const current = get().records[userId] || [];
    const updated = current.map((d) =>
      d.day === day ? { ...d, checkOut: time } : d
    );

    const exists = current.some((d) => d.day === day);
    const newWeek = exists ? updated : [...current, { day, checkOut: time }];

    const newRecords = {
      ...get().records,
      [userId]: newWeek,
    };

    set({ records: newRecords });
    saveToStorage(newRecords);
  },

  getWeek: (userId) => {
    return get().records[userId] || [];
  },
}));
