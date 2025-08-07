import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'EasyPagePC',
			fileName: 'index',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['react', 'antd', '@easy-page/core', '@ant-design/icons'],
			output: {
				globals: {
					react: 'React',
					antd: 'antd',
					'@easy-page/core': 'EasyPageCore',
					'@ant-design/icons': 'AntDesignIcons',
				},
			},
		},
	},
	plugins: [dts()],
	server: {
		port: 3004,
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
			'/sso/web/auth': {
				// 不要修改这个target，本地开发测试请使用http://ssodemo.it.test.sankuai.com
				target: 'http://ssodemo.it.test.sankuai.com',
				changeOrigin: true,
				xfwd: true,
			},
			'/zspt-agent-api': {
				// target: 'https://uoc.tsp.test.sankuai.com/',
				target: 'http://127.0.0.1:8000',
				changeOrigin: true,
				secure: false,
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
