export default function Footer() {
	return (
		<footer className="border-t border-on-surface-muted/10 bg-surface-dim px-4 py-12 text-center md:px-6 md:py-16">
			<div className="mx-auto max-w-6xl">
				<span className="text-lg font-bold tracking-tight text-primary">TechFlow</span>
				<p className="mt-3 text-sm leading-relaxed text-on-surface-muted">
					디지털 혁신을 이끄는 IT 컨설팅 파트너
				</p>
				<div className="mt-6 border-t border-on-surface-muted/10 pt-6">
					<p className="text-xs text-on-surface-muted">
						© {new Date().getFullYear()} TechFlow. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
