/**
 * Original atmospheric gradient mesh for the hero.
 *
 * Hand-built from blurred ellipses in the brand's gradient stops (cream,
 * sherbet, lavender, indigo, ruby, magenta). It is decorative only: the SVG is
 * hidden from assistive technology and a soft canvas scrim is layered over it by
 * the hero so text always keeps its contrast.
 */
export function GradientMesh({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			viewBox="0 0 1440 560"
			preserveAspectRatio="xMidYMid slice"
			fill="none"
		>
			<defs>
				<filter id="rk-mesh-blur" x="-40%" y="-40%" width="180%" height="180%">
					<feGaussianBlur stdDeviation="90" />
				</filter>
			</defs>
			<g filter="url(#rk-mesh-blur)" opacity="0.55">
				<ellipse cx="180" cy="170" rx="360" ry="220" fill="#f5e9d4" />
				<ellipse cx="470" cy="320" rx="320" ry="200" fill="#f6c88c" />
				<ellipse cx="820" cy="150" rx="360" ry="220" fill="#b9b9f9" />
				<ellipse cx="1120" cy="300" rx="340" ry="210" fill="#533afd" />
				<ellipse cx="1340" cy="140" rx="280" ry="200" fill="#ea2261" />
				<ellipse cx="1140" cy="40" rx="220" ry="150" fill="#f96bee" />
			</g>
		</svg>
	);
}
