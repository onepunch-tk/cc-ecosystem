export const toId = (label: string): string =>
	label.toLowerCase().replace(/\s+/g, "-");
