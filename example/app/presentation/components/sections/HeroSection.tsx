export default function HeroSection() {
	const handleCtaClick = () => {
		document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section
			id="hero"
			aria-label="Hero"
			className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-light px-4 text-center text-on-primary md:px-6 lg:px-8"
		>
			<h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl xl:text-6xl">
				디지털 혁신을 이끄는 파트너
			</h1>
			<p className="mb-8 max-w-2xl text-base leading-relaxed text-on-primary-muted md:mb-10 md:text-lg lg:text-xl">
				TechFlow는 IT 컨설팅 전문 기업입니다. 최신 기술과 풍부한 경험으로
				비즈니스의 디지털 전환을 함께합니다.
			</p>
			<button
				type="button"
				onClick={handleCtaClick}
				className="min-h-11 min-w-[120px] rounded-lg bg-accent px-8 py-3 text-base font-semibold text-on-primary motion-safe:transition-all motion-safe:duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-safe:active:scale-[0.98] md:text-lg"
			>
				문의하기
			</button>
		</section>
	);
}
