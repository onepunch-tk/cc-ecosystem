interface SectionWrapperProps {
	id: string;
	children: React.ReactNode;
	className?: string;
	variant?: "light" | "surface";
}

const variantClasses: Record<NonNullable<SectionWrapperProps["variant"]>, string> = {
	light: "bg-background",
	surface: "bg-surface",
};

export default function SectionWrapper({
	id,
	children,
	className,
	variant = "light",
}: SectionWrapperProps) {
	return (
		<section
			id={id}
			role="region"
			aria-label={id}
			className={`py-16 md:py-24 px-4 md:px-8 lg:px-12 ${variantClasses[variant]} ${className ?? ""}`.trim()}
		>
			<div className="max-w-7xl mx-auto">{children}</div>
		</section>
	);
}
