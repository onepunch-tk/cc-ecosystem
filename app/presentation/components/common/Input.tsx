interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

const toId = (label: string): string =>
	label.toLowerCase().replace(/\s+/g, "-");

export default function Input({ label, error, id, className, ...props }: InputProps) {
	const inputId = id ?? toId(label);

	return (
		<div className="space-y-1.5">
			<label htmlFor={inputId} className="block text-sm font-medium text-on-surface">
				{label}
			</label>
			<input
				id={inputId}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? `${inputId}-error` : undefined}
				className={`w-full border rounded-md px-4 py-2.5 text-on-surface bg-white placeholder:text-on-surface-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-error" : "border-border"} ${className ?? ""}`.trim()}
				{...props}
			/>
			{error && <p id={`${inputId}-error`} className="text-sm text-error" role="alert">{error}</p>}
		</div>
	);
}
