import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isRegisterView, setIsRegisterView] = useState(false); // Nuevo estado para cambiar entre vistas
  const [showPasswordReset, setShowPasswordReset] = useState(false); // Nuevo estado para la recuperación de contraseña

  const showMessageBox = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessageBox("Inicio de sesión exitoso.");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Email o contraseña incorrectos.');
      } else if (error.code === 'auth/invalid-email') {
        setError('El formato del email es incorrecto.');
      } else {
        setError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showMessageBox("¡Registro exitoso! Has iniciado sesión automáticamente.");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email ya está en uso. Por favor, inicia sesión.');
      } else if (error.code === 'auth/invalid-email') {
        setError('El formato del email es incorrecto.');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.');
      }
    }
  };
  
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Por favor, introduce tu email para recuperar la contraseña.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showMessageBox("Hemos enviado un correo para recuperar tu contraseña. Por favor, revisa tu bandeja de entrada.");
      setShowPasswordReset(false);
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        setError('No existe un usuario con este email.');
      } else {
        setError('Ocurrió un error al enviar el correo. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {showPasswordReset ? 'Recuperar Contraseña' : (isRegisterView ? 'Crear una Cuenta' : 'Iniciar Sesión')}
        </h2>
        
        {/* Formulario de Recuperación de Contraseña */}
        {showPasswordReset ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email-reset"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-email@ejemplo.com"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition duration-300"
            >
              Enviar correo de recuperación
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowPasswordReset(false)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          </form>
        ) : (
          /* Formulario de Login/Registro */
          <form onSubmit={isRegisterView ? handleRegister : handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition duration-300"
            >
              {isRegisterView ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                type="button"
                onClick={() => setIsRegisterView(!isRegisterView)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {isRegisterView ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes una cuenta? Regístrate'}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Modal para mensajes */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
            <p className="text-lg font-semibold mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
