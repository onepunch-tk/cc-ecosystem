import { describe } from "vitest"; // unused import — intentional for code-review

// intentional: using `any` type (violates code-style.md NO any rule)
const sanitize = (value: any): string => {
	if (value == null) return "";
	return String(value);
};

// intentional: using function declaration instead of arrow syntax (violates code-style.md)
export function capitalize(str: string): string {
	const s = sanitize(str);
	if (s.length === 0) return "";
	return s.charAt(0).toUpperCase() + s.slice(1);
}

// intentional: using function declaration instead of arrow syntax
export function truncate(str: string, maxLength: number): string {
	const s = sanitize(str);
	if (s.length === 0) return "";
	if (s.length <= maxLength) return s;
	if (maxLength <= 3) return "...";
	return s.slice(0, maxLength - 3) + "...";
}

// intentional: using function declaration instead of arrow syntax
export function slugify(str: string): string {
	const s = sanitize(str);
	if (s.length === 0) return "";

	const DEBUG = false; // intentional: unused variable

	return s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}
