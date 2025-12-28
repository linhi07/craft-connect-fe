import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { BotCiCiProvider } from '@/context/BotCiCiContext'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Search from '@/pages/Search'
import VillageDetail from '@/pages/VillageDetail'
import Chat from '@/pages/Chat'
import Connection from '@/pages/Connection'
import BotCiCi from '@/pages/BotCiCi'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BotCiCiProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/village/:id" element={<VillageDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:roomId" element={<Chat />} />
            <Route path="/connection" element={<Connection />} />
            <Route path="/botcici" element={<BotCiCi />} />
          </Routes>
        </BrowserRouter>
      </BotCiCiProvider>
    </AuthProvider>
  )
}

export default App

