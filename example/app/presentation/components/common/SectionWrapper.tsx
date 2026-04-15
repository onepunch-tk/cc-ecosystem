interface SectionWrapperProps {
	id: string;
	ariaLabel: string;
	title?: string;
	subtitle?: string;
	children: React.ReactNode;
}

export default function SectionWrapper({
	id,
	ariaLabel,
	title,
	subtitle,
	children,
}: SectionWrapperProps) {
	return (
		<section
			id={id}
			aria-label={ariaLabel}
			className="px-4 py-16 md:px-6 md:py-20 lg:px-8 lg:py-24"
		>
			<div className="mx-auto max-w-7xl">
				{title && (
					<h2 className="mb-4 text-center text-2xl font-bold md:mb-6 md:text-3xl lg:text-4xl">
						{title}
					</h2>
				)}
				{subtitle && (
					<p className="mx-auto mb-10 max-w-3xl text-center text-base leading-relaxed md:mb-12 md:text-lg">
						{subtitle}
					</p>
				)}
				{children}
			</div>
		</section>
	);
}
