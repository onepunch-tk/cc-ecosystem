export default function HeroSection() {
	return (
		<section
			id="hero"
			className="relative min-h-screen flex items-center bg-primary text-on-primary overflow-hidden"
		>
			<div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
				<div className="max-w-2xl space-y-6">
					<h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
						Hero Section
					</h1>
					<p className="text-lg md:text-xl text-on-primary-muted leading-relaxed max-w-xl">
						Hero description placeholder
					</p>
				</div>
			</div>
		</section>
	);
}
