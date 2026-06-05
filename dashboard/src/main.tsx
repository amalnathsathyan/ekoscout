import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SolanaWalletProvider } from './providers/WalletProvider.tsx'
import { TokenTierProvider } from './context/TokenTierContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SolanaWalletProvider>
      <TokenTierProvider>
        <App />
      </TokenTierProvider>
    </SolanaWalletProvider>
  </StrictMode>,
)
