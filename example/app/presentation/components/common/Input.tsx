interface InputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"label" | "error"
	> {
	label: string;
	name: string;
	error?: string;
}

export default function Input({
	label,
	name,
	type = "text",
	error,
	required,
	disabled,
	...rest
}: InputProps) {
	const errorId = error ? `${name}-error` : undefined;

	return (
		<div>
			<label htmlFor={name} className="mb-1 block text-sm font-medium text-on-surface">
				{label}
				{required && (
					<span className="ml-1 text-error" aria-hidden="true">*</span>
				)}
			</label>
			<input
				id={name}
				name={name}
				type={type}
				required={required}
				disabled={disabled}
				aria-invalid={error ? true : undefined}
				aria-describedby={errorId}
				className={`w-full rounded-lg border bg-background px-4 py-2.5 text-on-surface placeholder:text-on-surface-muted/50 motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-error" : "border-on-surface-muted/30 hover:border-on-surface-muted/50"}`}
				{...rest}
			/>
			{error && (
				<p id={errorId} role="alert" className="mt-1 text-sm text-error">
					{error}
				</p>
			)}
		</div>
	);
}
