// @services/checkApi.ts

/**
 * Simulación de una API para Check-In y Check-Out.
 * Usa localStorage para almacenar el estado del día actual.
 */

const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

export const checkIn = (): void => {
    localStorage.setItem(`checkIn-${TODAY}`, "true");
};

export const checkOut = (): void => {
    localStorage.setItem(`checkOut-${TODAY}`, "true");
};

export const isCheckedIn = (): boolean => {
    return localStorage.getItem(`checkIn-${TODAY}`) === "true";
};

export const isCheckedOut = (): boolean => {
    return localStorage.getItem(`checkOut-${TODAY}`) === "true";
};
