import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

const nextConfig: NextConfig = {
	/* config options here */
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				hostname: '**',
				protocol: 'https',
			},
			{
				hostname: '**',
				protocol: 'http',
			},
		],
	},
};

export default withNextIntl(nextConfig);
