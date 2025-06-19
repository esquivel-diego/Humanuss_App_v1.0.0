import { create } from "zustand";

export interface AttendanceRecord {
  day: string;          // "Lunes", "Martes", etc.
  checkIn?: string;
  checkOut?: string;
}

interface AttendanceStore {
  records: Record<number, AttendanceRecord[]>; // userId → semana
  markCheckIn: (userId: number, day: string, time: string) => void;
  markCheckOut: (userId: number, day: string, time: string) => void;
  getWeek: (userId: number) => AttendanceRecord[];
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  records: {},

  markCheckIn: (userId, day, time) => {
    const current = get().records[userId] || [];
    const updated = current.map((d) =>
      d.day === day ? { ...d, checkIn: time } : d
    );

    const exists = current.some((d) => d.day === day);
    const newWeek = exists
      ? updated
      : [...current, { day, checkIn: time }];

    set((state) => ({
      records: {
        ...state.records,
        [userId]: newWeek,
      },
    }));
  },

  markCheckOut: (userId, day, time) => {
    const current = get().records[userId] || [];
    const updated = current.map((d) =>
      d.day === day ? { ...d, checkOut: time } : d
    );

    const exists = current.some((d) => d.day === day);
    const newWeek = exists
      ? updated
      : [...current, { day, checkOut: time }];

    set((state) => ({
      records: {
        ...state.records,
        [userId]: newWeek,
      },
    }));
  },

  getWeek: (userId) => {
    return get().records[userId] || [];
  },
}));
