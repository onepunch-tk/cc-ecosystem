interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
}

const variantClasses = {
	primary:
		"bg-primary text-on-primary hover:bg-primary-light",
	secondary:
		"bg-surface text-on-surface hover:bg-background",
	outline:
		"border border-primary text-primary bg-transparent hover:bg-surface",
} as const;

const sizeClasses = {
	sm: "px-4 py-2 text-sm",
	md: "px-6 py-2.5 text-base",
	lg: "px-8 py-3 text-lg",
} as const;

export default function Button({
	children,
	variant = "primary",
	size = "md",
	disabled = false,
	onClick,
	type = "button",
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={`min-h-11 rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 motion-safe:transition-all motion-safe:duration-200 motion-safe:active:scale-[0.98] ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
		>
			{children}
		</button>
	);
}
