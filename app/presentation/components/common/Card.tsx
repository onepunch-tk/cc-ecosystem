interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export default function Card({ children, className }: CardProps) {
	return (
		<div
			className={`bg-white rounded-lg border border-border shadow-card hover:shadow-card-hover focus-within:shadow-card-hover transition-shadow duration-300 ease-in-out p-6 ${className ?? ""}`.trim()}
		>
			{children}
		</div>
	);
}
