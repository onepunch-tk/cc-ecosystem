interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	className?: string;
}

const variantClasses = {
	primary:
		"bg-accent text-on-primary hover:bg-accent-hover focus-visible:ring-offset-background",
	secondary:
		"bg-surface text-on-surface hover:bg-background border border-surface focus-visible:ring-offset-background",
	outline:
		"border border-on-surface-muted/30 text-on-surface bg-transparent hover:bg-surface hover:border-on-surface-muted/50 focus-visible:ring-offset-background",
} as const;

const sizeClasses = {
	sm: "px-4 py-2 text-sm",
	md: "px-6 py-2.5 text-base",
	lg: "px-8 py-3 text-lg",
} as const;

const baseClasses = [
	"inline-flex items-center justify-center",
	"min-h-11 rounded-lg font-semibold",
	"cursor-pointer select-none",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2",
	"motion-safe:transition-all motion-safe:duration-200 motion-safe:active:scale-[0.98]",
].join(" ");

export default function Button({
	children,
	variant = "primary",
	size = "md",
	disabled = false,
	onClick,
	type = "button",
	className = "",
}: ButtonProps) {
	const classes = [
		baseClasses,
		variantClasses[variant],
		sizeClasses[size],
		disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={classes}
		>
			{children}
		</button>
	);
}
