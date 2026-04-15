import { getHeroData } from "~/infrastructure/dummy-data";
import { scrollToSection } from "~/presentation/hooks/scroll-to-section";

const trustIndicators = [
	{ value: "200+", label: "프로젝트 완료" },
	{ value: "50+", label: "기업 파트너" },
	{ value: "99%", label: "고객 만족도" },
];

export default function HeroSection() {
	const { headline, subHeadline, ctaText, ctaTargetId } = getHeroData();

	return (
		<section
			id="hero"
			aria-label="TechFlow 소개"
			className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
		>
			{/* Background gradient */}
			<div className="absolute inset-0 bg-hero-gradient z-0" aria-hidden="true" />
			{/* SVG grid pattern overlay */}
			<div className="absolute inset-0 opacity-10 z-0 pointer-events-none" aria-hidden="true">
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
							<path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#hero-grid)" />
				</svg>
			</div>

			{/* Main content */}
			<div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
				{/* Left side content */}
				<div className="space-y-8">
					{/* Badge pill */}
					<div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-medium">
						<span className="mr-2 flex h-2 w-2 rounded-full bg-blue-400" aria-hidden="true" />
						No.1 IT Consulting Partner
					</div>

					<h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
						{headline}
					</h1>

					<p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
						{subHeadline}
					</p>

					<div className="flex flex-wrap gap-4 pt-4">
						<button
							type="button"
							onClick={() => scrollToSection(ctaTargetId)}
							className="px-8 py-4 bg-white text-navy-950 font-bold rounded-lg hover:bg-surface transition-all shadow-card-hover hover:shadow-card-lg transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
						>
							{ctaText}
						</button>
						<button
							type="button"
							onClick={() => scrollToSection("services")}
							className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
						>
							서비스 알아보기
						</button>
					</div>
				</div>

				{/* Right side visual (desktop only) */}
				<div className="hidden lg:block relative" aria-hidden="true">
					<div className="relative w-full aspect-square flex items-center justify-center">
						{/* Glow effect */}
						<div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
						{/* Glass card container */}
						<div className="relative w-4/5 h-4/5 bg-navy-800/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-card-lg overflow-hidden flex items-center justify-center">
							{/* Abstract pattern inside */}
							<div className="absolute inset-0 opacity-20">
								<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
									<defs>
										<pattern id="inner-grid" width="30" height="30" patternUnits="userSpaceOnUse">
											<circle cx="15" cy="15" r="1" fill="rgba(96,165,250,0.5)" />
										</pattern>
									</defs>
									<rect width="100%" height="100%" fill="url(#inner-grid)" />
								</svg>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
							{/* Floating glass cards */}
							<div className="absolute top-10 right-10 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-card-hover">
								<div className="text-blue-400 text-3xl mb-2" aria-hidden="true">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
								</div>
								<div className="text-white font-bold text-sm">Data Analytics</div>
							</div>
							<div className="absolute bottom-12 left-10 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-card-hover">
								<div className="text-sky-100 text-3xl mb-2" aria-hidden="true">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
								</div>
								<div className="text-white font-bold text-sm">Cloud Migration</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom trust indicators */}
			<div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-white/10">
					{trustIndicators.map((item) => (
						<div key={item.label} className="flex items-center space-x-4">
							<div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 border border-blue-400/20">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
							</div>
							<div>
								<div className="text-2xl font-black text-white">{item.value}</div>
								<div className="text-white/60 text-sm">{item.label}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
