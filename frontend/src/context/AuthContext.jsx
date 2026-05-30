import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || 'token-falso')
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('usuario')) ||  { nombre: 'Prueba', rol: 'admin' }
  )

  const login = (token, datosUsuario) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))
    setToken(token)
    setUsuario(datosUsuario)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, esAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}