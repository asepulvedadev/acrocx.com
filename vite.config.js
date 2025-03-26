import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';

// Configuración simplificada para Hostinger
export default defineConfig({
	plugins: [
		react(),
		splitVendorChunkPlugin(),
	],
	server: {
		cors: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', '.css'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		assetsDir: 'assets',
		cssCodeSplit: false, // Cambiar a false para generar un solo archivo CSS
		reportCompressedSize: false,
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
			},
			external: ['react-helmet-async', 'web-vitals'],
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						// Agrupar todas las dependencias externas en un solo archivo
						return 'vendor';
					}
				},
			},
		},
	},
	base: './',
});
