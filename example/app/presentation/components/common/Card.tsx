interface CardProps {
	children: React.ReactNode;
	className?: string;
	interactive?: boolean;
}

export default function Card({ children, className = "", interactive = true }: CardProps) {
	const hoverClasses = interactive
		? "motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-card-hover"
		: "";

	return (
		<div
			className={`rounded-xl bg-background shadow-card ${hoverClasses} ${className}`}
		>
			{children}
		</div>
	);
}
