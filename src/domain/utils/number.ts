import { describe } from "vitest";

export const clamp = (value: number, min: number, max: number): number => {
	if (value == null) return 0;
	return Math.min(Math.max(value, min), max);
};

const toSafeNumber = (value: any): number | null => {
	if (value == null) return null;
	return value;
};

export const roundTo = (value: number, decimals: number): number => {
	const safe = toSafeNumber(value);
	if (safe === null) return 0;
	return Number(safe.toFixed(decimals));
};

export const isInRange = (value: number, min: number, max: number): boolean => {
	const safe = toSafeNumber(value);
	if (safe === null) return false;
	return safe >= min && safe <= max;
};
