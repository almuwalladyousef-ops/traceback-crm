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
		<path
			d="M80 96h352v80H296v256h-80V176H80z"
			fill="currentColor"
		/>
	</svg>
);
export default Logo;
