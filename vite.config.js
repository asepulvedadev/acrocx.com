import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		return {
			html,
			tags: [
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: `
						window.onerror = (message, source, lineno, colno, errorObj) => {
							window.parent.postMessage({
								type: 'horizons-runtime-error',
								message,
								source,
								lineno,
								colno,
								error: errorObj && errorObj.stack
							}, '*');
						};
          `,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: `
						const observer = new MutationObserver((mutations) => {
							for (const mutation of mutations) {
								for (const addedNode of mutation.addedNodes) {
									if (
										addedNode.nodeType === Node.ELEMENT_NODE &&
										(
											addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
											addedNode.classList?.contains('backdrop')
										)
									) {
										handleViteOverlay(addedNode);
									}
								}
							}
						});

						observer.observe(document.documentElement, {
							childList: true,
							subtree: true
						});

						function handleViteOverlay(node) {
							if (!node.shadowRoot) {
								return;
							}

							const backdrop = node.shadowRoot.querySelector('.backdrop');

							if (backdrop) {
								const overlayHtml = backdrop.outerHTML;
								const parser = new DOMParser();
								const doc = parser.parseFromString(overlayHtml, 'text/html');
								const messageBodyElement = doc.querySelector('.message-body');
								const fileElement = doc.querySelector('.file');
								const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
								const fileText = fileElement ? fileElement.textContent.trim() : '';
								const error = messageText + (fileText ? ' File:' + fileText : '');

								window.parent.postMessage({
									type: 'horizons-vite-error',
									error,
								}, '*');
							}
						}
          `,
					injectTo: 'head',
				},
			],
		};
	},
};

export default defineConfig({
	plugins: [
		react(),
		addTransformIndexHtml,
		splitVendorChunkPlugin(),
		visualizer({
			filename: 'dist/stats.html',
			gzipSize: true,
			brotliSize: true,
		}),
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
			},
		},
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
			},
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'],
					ui: [
						'@radix-ui/react-alert-dialog',
						'@radix-ui/react-avatar',
						'@radix-ui/react-checkbox',
						'@radix-ui/react-dialog',
						'@radix-ui/react-dropdown-menu',
						'@radix-ui/react-label',
						'@radix-ui/react-slot',
						'@radix-ui/react-tabs',
						'@radix-ui/react-toast',
						'@radix-ui/react-slider',
					],
					utils: [
						'class-variance-authority',
						'clsx',
						'tailwind-merge',
						'tailwindcss-animate',
					],
				},
			},
		},
	},
	base: './',
});
