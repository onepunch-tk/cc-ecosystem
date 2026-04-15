interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
	return (
		<div
			className={`rounded-xl shadow-card motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-card-hover ${className}`}
		>
			{children}
		</div>
	);
}
