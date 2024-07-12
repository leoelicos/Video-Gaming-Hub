import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3002,
		open: true,
		proxy: {
			'/graphql': {
				target:
					process.env.NODE_ENV === 'production'
						? 'https://video-gaming-hub.onrender.com'
						: 'http://localhost:3001',
				secure: false,
				changeOrigin: true,
			},
		},
	},
})
