import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},
	server: {
		port: 3001,
		proxy: {
			'/api/zspt/operation/common': {
				target: 'https://uoc.tsp.test.sankuai.com',
				changeOrigin: true,
				secure: false,
			},
			'/zspt-admin-api': {
				// target: 'https://uoc.tsp.test.sankuai.com/',
				target: 'http://127.0.0.1:8080',
				changeOrigin: true,
				secure: false,
			},
			'/zspt-agent-api': {
				// target: 'https://uoc.tsp.test.sankuai.com/',
				target: 'http://127.0.0.1:8000',
				changeOrigin: true,
				secure: false,
			},
			'/api/ka': {
				// target: 'http://127.0.0.1:8000',
				// target: 'https://uoc.tsp.test.sankuai.com/',
				target: 'https://marketingop.waimai.test.sankuai.com',
				changeOrigin: true,
				secure: false,
			},

			'/runs': {
				target: 'ws://localhost:8000',
				ws: true,
				changeOrigin: true,
			},
			'/api/zspt/xf': {
				// target: 'http://127.0.0.1:8000',
				// target: 'https://uoc.tsp.test.sankuai.com/',
				target: 'https://marketingop.waimai.test.sankuai.com',
				changeOrigin: true,
				secure: false,
			},
			'/common/getCsrfToken': {
				target: 'https://marketingop.waimai.test.sankuai.com',
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
