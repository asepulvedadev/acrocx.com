import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// Configuración optimizada para producción
export default defineConfig({
	plugins: [
		react(),
		splitVendorChunkPlugin(),
		compression({
			algorithm: 'gzip',
			ext: '.gz',
			threshold: 1024
		}),
		compression({
			algorithm: 'brotliCompress',
			ext: '.br',
			threshold: 1024
		}),
		visualizer({
			open: false,
			gzipSize: true,
			brotliSize: true
		})
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
		cssCodeSplit: true,
		reportCompressedSize: false,
		chunkSizeWarningLimit: 1000,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
			},
		},
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
			},
			output: {
				manualChunks: {
					'vendor': ['react', 'react-dom', 'react-router-dom'],
					'ui': ['@radix-ui/react-toast', '@radix-ui/react-dialog', '@radix-ui/react-slot'],
					'animations': ['framer-motion'],
					'icons': ['lucide-react'],
					'utils': ['class-variance-authority', 'clsx', 'tailwind-merge']
				},
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split('.').at(1);
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						extType = 'img';
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
		},
	},
	base: './',
});
