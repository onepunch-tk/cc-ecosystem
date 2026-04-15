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
	return (
		<div>
			<label htmlFor={name} className="mb-1 block text-sm font-medium text-on-surface">
				{label}
				{required && (
					<span className="ml-1 text-error">*</span>
				)}
			</label>
			<input
				id={name}
				name={name}
				type={type}
				required={required}
				disabled={disabled}
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
