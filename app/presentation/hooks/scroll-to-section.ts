export const scrollToSection = (targetId: string): void => {
	const element = document.getElementById(targetId);
	if (element) {
		element.scrollIntoView({ behavior: "smooth", block: "start" });
	}
};
