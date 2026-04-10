const sanitize = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "string" && typeof value !== "number") return "";
	return String(value);
};

export const capitalize = (str: string): string => {
	const s = sanitize(str);
	if (s.length === 0) return "";
	return s.charAt(0).toUpperCase() + s.slice(1);
};

export const truncate = (str: string, maxLength: number): string => {
	const s = sanitize(str);
	if (s.length === 0) return "";
	if (s.length <= maxLength) return s;
	if (maxLength <= 3) return "...";
	return s.slice(0, maxLength - 3) + "...";
};

export const slugify = (str: string): string => {
	const s = sanitize(str);
	if (s.length === 0) return "";

	return s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
};
