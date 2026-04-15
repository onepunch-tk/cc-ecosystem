import { toId } from "~/presentation/utils/to-id";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export default function Input({ label, error, id, className, ...props }: InputProps) {
	const inputId = id ?? toId(label);

	return (
		<div className="space-y-2">
			<label htmlFor={inputId} className="block text-sm font-semibold text-on-surface">
				{label}
			</label>
			<input
				id={inputId}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? `${inputId}-error` : undefined}
				className={`w-full border rounded-lg px-4 py-3 text-on-surface bg-surface placeholder:text-on-surface-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-error" : "border-border"} ${className ?? ""}`.trim()}
				{...props}
			/>
			{error && <p id={`${inputId}-error`} className="text-sm text-error" role="alert">{error}</p>}
		</div>
	);
}
