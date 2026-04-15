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
	return (
		<div>
			<label htmlFor={name} className="mb-1 block text-sm font-medium text-on-surface">
				{label}
				{required && (
					<span className="ml-1 text-error">*</span>
				)}
			</label>
			<textarea
				id={name}
				name={name}
				rows={rows}
				required={required}
				className="w-full rounded-lg border border-on-surface-muted/30 bg-background px-4 py-2 text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
				{...rest}
			/>
			{error && (
				<p role="alert" className="mt-1 text-sm text-error">
					{error}
				</p>
			)}
		</div>
	);
}
