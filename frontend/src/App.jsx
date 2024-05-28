import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ListaDeCarros from './components/ListaDeCarros';
import Formulario from './components/Formulario';
import Modal from './components/Modal';
import MainNav from './components/MainNav';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import useToken from './components/useToken';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState({});
  const [carros, setCarros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, setToken, removeToken, isAdmin } = useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarros();
  }, []);

  const fetchCarros = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/carros");
      if (!response.ok) {
        throw new Error('Falha ao buscar carros.');
      }
      const data = await response.json();
      setCarros(data.carros);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCar({});
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const openEditModal = (carro) => {
    if (isModalOpen) return;
    setCurrentCar(carro);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchCarros();
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="App">
      <MainNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <>
              {isLoggedIn && isAdmin() ? (
                <>
                  <Button className="mb-5 mt-5" onClick={openCreateModal} variant="success">
                    Criar Novo
                  </Button>
                </>
              ) : <div className='mb-5'></div>}
              <ListaDeCarros
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin()}
                carros={carros}
                isLoading={isLoading}
                error={error}
                updateCar={openEditModal}
                updateCallBack={onUpdate}
              />
            </>
          }
        />
      </Routes>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Formulario existingCar={currentCar} updateCallBack={onUpdate} />
      </Modal>
    </div>
  );
}

export default App;
