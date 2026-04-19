// Design tokens extracted from main.css and main.js

export const colors = {
    bg: '#080808',
    surface: '#111111',
    surface2: '#1a1a1a',
    border: '#222222',
    text: '#e8e8e8',
    muted: '#666666',
    accent: '#ff3b3b',
    accentGlow: 'rgba(255, 59, 59, 0.15)',
    warm: '#ffaa00',
} as const

export const fonts = {
    mono: '"JetBrains Mono", monospace',
    sans: '"Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif',
} as const

export const PROD_BASE_URL = 'https://test.jiligulu.xyz'
