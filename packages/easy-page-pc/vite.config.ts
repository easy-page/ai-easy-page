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
});
