export const formatDate = (date: unknown, format: string): string => {
	if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
		return "";
	}

	const yyyy = date.getFullYear().toString();
	const mm = (date.getMonth() + 1).toString().padStart(2, "0");
	const dd = date.getDate().toString().padStart(2, "0");

	switch (format) {
		case "YYYY-MM-DD":
			return `${yyyy}-${mm}-${dd}`;
		case "YYYY/MM/DD":
			return `${yyyy}/${mm}/${dd}`;
		case "DD-MM-YYYY":
			return `${dd}-${mm}-${yyyy}`;
		case "MM/DD/YYYY":
			return `${mm}/${dd}/${yyyy}`;
		default:
			return `${yyyy}-${mm}-${dd}`;
	}
};

export const isValidDate = (value: unknown): boolean => {
	return value instanceof Date && !Number.isNaN(value.getTime());
};

export const daysBetween = (from: Date, to: Date): number => {
	const msPerDay = 1000 * 60 * 60 * 24;
	const diffMs = Math.abs(to.getTime() - from.getTime());
	return Math.round(diffMs / msPerDay);
};
