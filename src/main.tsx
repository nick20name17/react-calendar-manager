import ReactDOM from 'react-dom/client'

import { App } from './app.tsx'
import { Providers } from './providers/index.tsx'
import '@/assets/styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Providers>
        <App />
    </Providers>
)
