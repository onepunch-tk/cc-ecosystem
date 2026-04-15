import { getServicesData } from "~/infrastructure/dummy-data";

const serviceIcons = [
	/* Cloud icon */
	<svg key="cloud" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>,
	/* Sync/Transform icon */
	<svg key="sync" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>,
	/* Security/Shield icon */
	<svg key="shield" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
	/* Data/Chart icon */
	<svg key="chart" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
];

export default function ServicesSection() {
	const { tagline, heading, description, services } = getServicesData();

	return (
		<section id="services" className="relative py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-navy-950 tech-grid text-white">
			{/* Section header */}
			<div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
				<span className="inline-block py-1 px-3 mb-4 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-widest uppercase">
					{tagline}
				</span>
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-services-gradient">
					{heading}
				</h2>
				<p className="text-lg md:text-xl text-on-primary-muted font-light leading-relaxed">
					{description}
				</p>
			</div>

			{/* Services 2x2 grid */}
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
				{services.map((service, index) => (
					<div
						key={service.title}
						className="group glass-card p-8 md:p-10 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-card-lg relative overflow-hidden"
					>
						{/* Background glow on hover */}
						<div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-300" aria-hidden="true" />
						<div className="flex flex-col h-full relative">
							{/* Icon container */}
							<div className="w-14 h-14 mb-8 flex items-center justify-center rounded-xl bg-primary text-white shadow-card-hover">
								{serviceIcons[index]}
							</div>
							<h3 className="text-2xl font-bold mb-4">{service.title}</h3>
							<p className="text-on-primary-muted leading-relaxed mb-6">
								{service.description}
							</p>
							<div className="mt-auto flex items-center text-blue-300 font-medium text-sm group-hover:text-blue-400 transition-colors">
								<span>자세히 보기</span>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Bottom CTA */}
			<div className="mt-16 md:mt-20 text-center">
				<button
					type="button"
					className="group relative px-10 py-5 bg-white text-navy-950 font-bold rounded-lg shadow-card-hover hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
				>
					<span className="relative z-10">전체 서비스 보기</span>
					<div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
				</button>
			</div>
		</section>
	);
}
