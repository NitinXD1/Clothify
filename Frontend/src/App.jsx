import './App.css'

import { Routes, Route , Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LogInPage from './pages/LogInPage.jsx'
import NavBar from './components/NavBar.jsx'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore.js'
import { useEffect } from 'react'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import AdminPage from './pages/AdminPage.jsx'

function App() {

  const {user , checkAuth , checkingAuth} = useUserStore()

  useEffect(() => {
    checkAuth();
  },[checkAuth])

  if(checkingAuth){
    return <LoadingSpinner />
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>

      {/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2
           w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

			<div className='relative z-50 pt-20'>

        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path="/login" element={!user ? <LogInPage/> : <Navigate to='/' />} />
          <Route path="/secret-dashboard" element={user && user.role === 'admin' ? <AdminPage /> : <LogInPage/>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>

        <Toaster />

      </div>
    </div>
  )
}

export default App
