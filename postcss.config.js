export default {
	plugins: {
		'postcss-import': {},
		'tailwindcss/nesting': {},
		tailwindcss: {},
		autoprefixer: {
			flexbox: 'no-2009',
			grid: 'autoplace'
		},
		'postcss-preset-env': {
			stage: 3,
			features: {
				'nesting-rules': false,
				'custom-properties': false,
				'color-function': { preserve: true }
			}
		},
		...(process.env.NODE_ENV === 'production' ? {
			cssnano: {
				preset: ['default', {
					discardComments: { removeAll: true },
					normalizeWhitespace: true,
					minifyFontValues: true,
					minifyGradients: true,
					mergeLonghand: true,
					mergeRules: true,
					calc: true,
					colormin: true
				}]
			}
		} : {})
	}
};
