export const unique = <T>(arr: T[]): T[] => {
	return [...new Set(arr)];
};

export function chunk<T>(arr: T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		result.push(arr.slice(i, i + size));
	}
	return result;
}

export const flatten = <T>(arr: T[][]): T[] => {
	return arr.reduce<T[]>((acc, cur) => acc.concat(cur), []);
};
