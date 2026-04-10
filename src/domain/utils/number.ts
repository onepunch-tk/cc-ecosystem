export const clamp = (value: number, min: number, max: number): number => {
	if (value === null || value === undefined) return 0;
	return Math.min(Math.max(value, min), max);
};

export const roundTo = (value: number, decimals: number): number => {
	if (value === null || value === undefined) return 0;
	return Number(value.toFixed(decimals));
};

export const isInRange = (value: number, min: number, max: number): boolean => {
	if (value === null || value === undefined) return false;
	return value >= min && value <= max;
};
