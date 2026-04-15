interface CardProps {
	children: React.ReactNode;
	className?: string;
}

export default function Card({ children, className }: CardProps) {
	return (
		<div
			className={`group bg-white rounded-xl border border-border shadow-card hover:shadow-card-lg hover:-translate-y-2 focus-within:shadow-card-hover transition-all duration-300 ease-in-out p-8 md:p-10 ${className ?? ""}`.trim()}
		>
			{children}
		</div>
	);
}
