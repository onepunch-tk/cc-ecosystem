export default function AboutSection() {
	return (
		<section id="about" className="bg-background py-16 md:py-24 px-4 md:px-8 lg:px-12">
			<div className="max-w-7xl mx-auto">
				<div className="mb-12 md:mb-20">
					<div className="flex items-center gap-4 mb-4">
						<div className="h-0.5 w-12 bg-accent" />
						<span className="text-xs font-bold tracking-widest uppercase text-accent">
							About
						</span>
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-on-surface">
						About Section
					</h2>
				</div>
				<p className="text-lg text-on-surface-muted leading-relaxed max-w-2xl">
					About description placeholder
				</p>
			</div>
		</section>
	);
}
