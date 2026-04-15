export default function Footer() {
	return (
		<footer className="border-t border-on-surface-muted/10 bg-background px-4 py-8 text-center">
			<span className="text-sm font-semibold text-primary">TechFlow</span>
			<p className="mt-2 text-xs text-on-surface-muted">
				© {new Date().getFullYear()} TechFlow. All rights reserved.
			</p>
		</footer>
	);
}
