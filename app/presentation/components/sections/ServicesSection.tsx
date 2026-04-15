import { getServicesData } from "~/infrastructure/dummy-data";

const serviceIcons = ["cloud", "sync_alt", "security", "monitoring"];

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
								<span className="material-symbols-outlined text-3xl" aria-hidden="true">{serviceIcons[index]}</span>
							</div>
							<h3 className="text-2xl font-bold mb-4">{service.title}</h3>
							<p className="text-on-primary-muted leading-relaxed mb-6">
								{service.description}
							</p>
							<div className="mt-auto flex items-center text-blue-300 font-medium text-sm group-hover:text-blue-400 transition-colors">
								<span>자세히 보기</span>
								<span className="material-symbols-outlined ml-2 text-sm" aria-hidden="true">arrow_forward</span>
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
