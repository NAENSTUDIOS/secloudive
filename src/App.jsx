import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import { ChallengeProvider } from './context/ChallengeContext'

export default function App() { return <BrowserRouter><ChallengeProvider><div className="app-shell"><Navbar /><AppRoutes /><Footer /></div></ChallengeProvider></BrowserRouter> }
