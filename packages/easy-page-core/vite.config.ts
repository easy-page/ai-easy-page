import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts',
			name: 'EasyPageCore',
			fileName: 'index',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['react', 'mobx', 'mobx-react'],
			output: {
				globals: {
					react: 'React',
					mobx: 'mobx',
					'mobx-react': 'mobxReact',
				},
			},
		},
		cssCodeSplit: false,
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},
	plugins: [dts()],
});
