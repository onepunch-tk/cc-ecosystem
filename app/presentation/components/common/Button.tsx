type ButtonVariant = "solid" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
	solid:
		"bg-primary text-on-primary hover:bg-primary-light active:bg-primary-light/90 focus-visible:ring-accent focus-visible:ring-offset-2",
	ghost:
		"bg-transparent text-primary border border-primary hover:bg-primary/5 active:bg-primary/10 focus-visible:ring-accent focus-visible:ring-offset-2",
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: "px-4 py-2 text-sm",
	md: "px-6 py-3 text-base",
	lg: "px-8 py-4 text-lg",
};

export default function Button({
	variant = "solid",
	size = "md",
	className,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ""}`.trim()}
			{...props}
		>
			{children}
		</button>
	);
}
