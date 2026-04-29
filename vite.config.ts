import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /** 항상 같은 주소로 접속하도록 고정 (포트 충돌 시 오류로 알림, 숨은 5174 전환 방지) */
    port: 5173,
    strictPort: true,
    /** `npm run dev` 실행 시 브라우저 자동 오픈 — 서버 미기동 상태로 새로고침만 하는 실수 완화 */
    open: true,
    /**
     * IPv4 루프백에 고정 → http://127.0.0.1:5173 / http://localhost:5173 접속 안정화
     * (host: true 시 일부 환경에서 방화벽·바인딩 이슈로 접근 실패하는 경우 완화)
     */
    host: '127.0.0.1',
  },
  preview: {
    port: 4173,
    host: '127.0.0.1',
  },
})
