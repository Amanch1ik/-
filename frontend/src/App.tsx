import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import styled from 'styled-components'

// Базовые стили
const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;

  a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`

const Home = () => (
  <AppContainer>
    <h1>🚀 Bonus App</h1>
    <p>Добро пожаловать в систему бонусов и вознаграждений!</p>
    <div>
      <Link to="/login">Войти</Link>
      <Link to="/dashboard">Личный кабинет</Link>
    </div>
  </AppContainer>
)

const Login = () => (
  <AppContainer>
    <h2>Вход в систему</h2>
    <form>
      <input type="text" placeholder="Логин" />
      <input type="password" placeholder="Пароль" />
      <button type="submit">Войти</button>
    </form>
    <Link to="/">Назад на главную</Link>
  </AppContainer>
)

const Dashboard = () => (
  <AppContainer>
    <h2>Личный кабинет</h2>
    <p>Здесь будет отображаться информация о ваших бонусах</p>
    <Link to="/">Назад на главную</Link>
  </AppContainer>
)

const App: React.FC = () => {
  return (
    <Router>
      <Navigation>
        <Link to="/">Главная</Link>
        <Link to="/login">Вход</Link>
        <Link to="/dashboard">Кабинет</Link>
      </Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
