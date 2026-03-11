import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Books from "./pages/Books"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyBooks from "./pages/MyBooks"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-books" element={<MyBooks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App