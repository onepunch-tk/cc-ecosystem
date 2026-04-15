export default function Header() {
	return (
		<header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-on-surface/10 shadow-card">
			<div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 max-w-7xl mx-auto">
				<div className="text-xl md:text-2xl font-black tracking-tighter text-primary">
					TechFlow
				</div>
				<nav className="hidden md:flex items-center gap-8">
					<span className="text-on-surface-muted text-sm">Nav placeholder</span>
				</nav>
			</div>
		</header>
	);
}
