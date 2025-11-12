import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // 🔥 添加以下关键配置：
  base: '/MindBloom/', // 重要：替换为你的实际仓库名
  build: {
    outDir: 'dist', // 明确指定输出目录
  }
});
