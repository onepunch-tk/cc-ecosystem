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
				className={`w-full border rounded-md px-4 py-2.5 text-on-surface placeholder:text-on-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent ${error ? "border-error" : "border-border"} ${className ?? ""}`.trim()}
				{...props}
			/>
			{error && <p className="text-sm text-error">{error}</p>}
		</div>
	);
}
