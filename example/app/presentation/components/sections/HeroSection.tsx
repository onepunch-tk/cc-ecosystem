export default function HeroSection() {
	const handleCtaClick = () => {
		document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section
			id="hero"
			className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-4 text-center text-white"
		>
			<h1 className="mb-4 text-4xl font-bold md:text-6xl">
				디지털 혁신을 이끄는 파트너
			</h1>
			<p className="mb-8 max-w-2xl text-lg text-slate-300 md:text-xl">
				TechFlow는 IT 컨설팅 전문 기업입니다. 최신 기술과 풍부한 경험으로
				비즈니스의 디지털 전환을 함께합니다.
			</p>
			<button
				type="button"
				onClick={handleCtaClick}
				className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
			>
				문의하기
			</button>
		</section>
	);
}
