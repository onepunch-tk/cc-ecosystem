import { useEffect, useRef } from "react";
import { getNavItems } from "~/infrastructure/dummy-data";
import { scrollToSection } from "~/presentation/hooks/scroll-to-section";

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

const navItems = getNavItems();

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
	const navRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
				return;
			}
			if (e.key === "Tab" && navRef.current) {
				const focusable = navRef.current.querySelectorAll<HTMLElement>("button");
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		const firstButton = navRef.current?.querySelector<HTMLElement>("button");
		firstButton?.focus();

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<nav
			ref={navRef}
			aria-label="모바일 네비게이션"
			className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-card animate-in"
		>
			<div className="flex flex-col py-2">
				{navItems.map((item) => (
					<button
						key={item.targetId}
						type="button"
						onClick={() => {
							scrollToSection(item.targetId);
							onClose();
						}}
						className="w-full text-left px-4 py-3 text-on-surface hover:bg-surface active:bg-surface/80 focus-visible:outline-none focus-visible:bg-surface focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-200"
					>
						{item.label}
					</button>
				))}
			</div>
		</nav>
	);
}
