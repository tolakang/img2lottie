import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ViewerPage from './pages/ViewerPage'

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark'
    document.documentElement.classList.add(theme)
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/viewer" element={<ViewerPage />} />
      </Routes>
    </Layout>
  )
}

export default App
