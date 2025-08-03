import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'EasyPageMobile',
			fileName: 'index',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['react', 'antd-mobile', '@easy-page/core'],
			output: {
				globals: {
					react: 'React',
					'antd-mobile': 'antdMobile',
					'@easy-page/core': 'EasyPageCore',
				},
			},
		},
	},
	plugins: [dts()],
});
