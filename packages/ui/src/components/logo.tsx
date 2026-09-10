import type * as React from "react";

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={512}
		height={512}
		viewBox="0 0 512 512"
		fill="none"
		aria-label="Traceback Logo"
		{...props}
	>
		<image href="/traceback-logo.png" width={512} height={512} />
	</svg>
);
export default Logo;
