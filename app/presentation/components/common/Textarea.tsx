interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string;
	error?: string;
}

const toId = (label: string): string =>
	label.toLowerCase().replace(/\s+/g, "-");

export default function Textarea({
	label,
	error,
	id,
	rows = 4,
	className,
	...props
}: TextareaProps) {
	const textareaId = id ?? toId(label);

	return (
		<div className="space-y-1.5">
			<label htmlFor={textareaId} className="block text-sm font-medium text-on-surface">
				{label}
			</label>
			<textarea
				id={textareaId}
				rows={rows}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? `${textareaId}-error` : undefined}
				className={`w-full border rounded-md px-4 py-2.5 text-on-surface bg-white placeholder:text-on-surface-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${error ? "border-error" : "border-border"} ${className ?? ""}`.trim()}
				{...props}
			/>
			{error && <p id={`${textareaId}-error`} className="text-sm text-error" role="alert">{error}</p>}
		</div>
	);
}
