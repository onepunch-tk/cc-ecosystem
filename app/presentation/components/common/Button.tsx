type ButtonVariant = "solid" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const baseClasses = [
	"inline-flex items-center justify-center",
	"rounded-lg font-bold select-none",
	"transition-all duration-200 ease-in-out",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
	"disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

const variantClasses: Record<ButtonVariant, string> = {
	solid:
		"bg-primary text-on-primary hover:bg-primary-light active:bg-primary-light/90 focus-visible:ring-accent",
	ghost:
		"bg-transparent text-primary border border-primary hover:bg-primary/5 active:bg-primary/10 focus-visible:ring-accent",
	accent:
		"bg-accent text-on-primary hover:bg-accent-hover active:bg-accent-hover/90 focus-visible:ring-accent shadow-card hover:shadow-card-hover",
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
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ""}`.trim()}
			{...props}
		>
			{children}
		</button>
	);
}
