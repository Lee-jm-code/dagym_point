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
    /** localhost 이름 해석/IPv6 이슈 시 연결 실패 완화 + 터미널에 Network 주소 출력 */
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
})
