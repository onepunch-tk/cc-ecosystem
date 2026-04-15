const fieldClasses =
	"w-full rounded-lg border bg-background px-4 py-3 text-on-surface placeholder:text-on-surface-muted/50 motion-safe:transition-all motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50";

interface TextareaProps
	extends Omit<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		"label" | "error"
	> {
	label: string;
	name: string;
	error?: string;
}

export default function Textarea({
	label,
	name,
	rows = 4,
	error,
	required,
	...rest
}: TextareaProps) {
	const errorId = error ? `${name}-error` : undefined;

	return (
		<div>
			<label htmlFor={name} className="mb-1 block text-sm font-medium text-on-surface">
				{label}
				{required && (
					<span className="ml-1 text-error" aria-hidden="true">*</span>
				)}
			</label>
			<textarea
				id={name}
				name={name}
				rows={rows}
				required={required}
				aria-invalid={error ? true : undefined}
				aria-describedby={errorId}
				className={`${fieldClasses} ${error ? "border-error" : "border-on-surface-muted/30 hover:border-on-surface-muted/50"}`}
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
