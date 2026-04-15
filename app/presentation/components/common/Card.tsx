interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export default function Card({ children, className }: CardProps) {
	return (
		<div
			className={`bg-white rounded-lg border border-border shadow-card hover:shadow-card-hover transition-shadow p-6 ${className ?? ""}`.trim()}
		>
			{children}
		</div>
	);
}
