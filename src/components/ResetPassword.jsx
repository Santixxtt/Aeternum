import { useState, useEffect } from 'react';
import '../assets/css/reset_password.css';

// URL base de tu backend (debe coincidir con la de tu servidor)
const API_BASE_URL = "http://127.0.0.1:8000";

// Renombrado a App para que sea el componente principal de la página
const App = () => {
    // ----------------------------------------------------
    // ESTADO DEL COMPONENTE
    // ----------------------------------------------------
    const [view, setView] = useState('loading'); // 'request', 'reset', 'success', 'error', 'loading'
    const [token, setToken] = useState(null);
    const [correo, setCorreo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ----------------------------------------------------
    // EFECTO DE INICIALIZACIÓN: Verifica el token en la URL
    // ----------------------------------------------------
    useEffect(() => {
        // Asumiendo que esta es la única lógica en la página, 
        // revisamos los parámetros al cargar.
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        
        // Verifica si la URL actual es la ruta de restablecimiento.
        // Si hay token, va a la vista 'reset'.
        if (urlToken) {
            setToken(urlToken);
            setView('reset');
        } 
        // Si no hay token Y la URL actual no es la ruta de restablecimiento, 
        // va a la vista 'request'.
        else if (window.location.pathname.includes('restablecer-contrasena')) {
             // Si llegamos aquí sin token, generalmente es un error, 
             // pero forzaremos la vista de solicitud si la ruta coincide.
             setView('request');
        } 
        // Si la URL es la raíz (o cualquier otra), 
        // asumimos que el usuario debe solicitar el enlace.
        else {
             setView('request');
        }
    }, []);

    // ----------------------------------------------------
    // FUNCIÓN: Solicitar Enlace de Recuperación (Vista 'request')
    // ----------------------------------------------------
    const handleRequestRecovery = async () => {
        if (!correo) {
            setMensaje("Por favor, ingresa tu correo electrónico.");
            return;
        }

        setIsLoading(true);
        setMensaje('');

        try {
            const apiUrl = `${API_BASE_URL}/password/recuperar_contrasena?correo=${encodeURIComponent(correo)}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                setMensaje("Si el correo está registrado, recibirás un enlace de recuperación. Revisa tu bandeja de entrada.");
                setView('success');
            } else {
                const data = await response.json();
                setMensaje(data.detail || "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.");
                setView('error');
            }

        } catch (error) {
            console.error("Error de red:", error);
            setMensaje("No se pudo conectar con el servidor. Verifica tu conexión.");
            setView('error');
        } finally {
            setIsLoading(false);
        }
    };

    // ----------------------------------------------------
    // FUNCIÓN: Restablecer Contraseña (Vista 'reset')
    // ----------------------------------------------------
    const handleResetPassword = async () => {
        if (nuevaContrasena.length < 8) {
            setMensaje("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (nuevaContrasena !== confirmarContrasena) {
            setMensaje("Las contraseñas no coinciden.");
            return;
        }

        setIsLoading(true);
        setMensaje('');

        const MAX_RETRIES = 3;
        const DELAY_MS = 1000;
        
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const apiUrl = `${API_BASE_URL}/password/restablecer_contrasena?token=${encodeURIComponent(token)}&nueva_contrasena=${encodeURIComponent(nuevaContrasena)}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setMensaje("¡Contraseña restablecida con éxito! Ya puedes iniciar sesión.");
                    setView('success');
                    return; 
                } else if (response.status === 400) {
                    setMensaje(data.detail || "El enlace de restablecimiento es inválido o ha expirado.");
                    setView('error');
                    return; 
                } else {
                    throw new Error(data.detail || `Error del servidor: ${response.status}`);
                }

            } catch (error) {
                console.error(`Intento ${attempt + 1} fallido:`, error);
                
                if (attempt === MAX_RETRIES - 1) {
                    setMensaje("No se pudo completar la operación. Inténtalo más tarde.");
                    setView('error');
                } else {
                    await new Promise(resolve => setTimeout(resolve, DELAY_MS * Math.pow(2, attempt)));
                }
            } finally {
                // Solo desactiva la carga si el bucle termina o si la operación fue exitosa/con error irrecuperable
                if (attempt === MAX_RETRIES - 1 || view === 'success' || view === 'error') {
                     setIsLoading(false);
                }
            }
        }
    };

    const BackArrowSVG = (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="reset-back-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );

    const renderRequestView = () => (
        <>
            <h2 className="text-3xl font-bold reset-section-title mb-6 text-center">Recuperar Contraseña</h2>
            <p className="reset-section-subtitle mb-6 text-center">Ingresa tu correo electrónico para recibir un enlace de restablecimiento.</p>
            <div className="reset-form-group">
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            
            <button
                onClick={handleRequestRecovery}
                className={`reset-btn ${isLoading ? 'reset-btn-loading' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </div>
                ) : 'Enviar Enlace'}
            </button>
        </>
    );

    const renderResetView = () => (
        <>
            <h2 className="text-3xl font-bold reset-section-title mb-6 text-center">Establecer Nueva Contraseña</h2>
            <p className="reset-section-subtitle mb-6 text-center">Ingresa y confirma tu nueva contraseña.</p>
            <div className="reset-form-group">
                <input
                    type="password"
                    placeholder="Nueva Contraseña (mín. 8 caracteres)"
                    value={nuevaContrasena}
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <div className="reset-form-group">
                <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            
            <button
                onClick={handleResetPassword}
                className={`reset-btn ${isLoading ? 'reset-btn-loading' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Restableciendo...
                    </div>
                ) : 'Restablecer Contraseña'}
            </button>
        </>
    );

    const renderMessageView = (isSuccess) => (
        <div className={`p-6 rounded-xl reset-message ${isSuccess ? 'success' : 'error'}`}>
            <div className="flex items-center justify-center mb-4">
                {isSuccess ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-current" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-current" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            <p className="text-lg font-semibold mb-4 text-center text-current">{isSuccess ? "Operación Exitosa" : "Error de Operación"}</p>
            <p className="text-center text-current">{mensaje}</p>
            <div className="flex justify-center mt-6">
                {/* Usamos un <a> simple para evitar la dependencia de react-router-dom */}
                <a href="/" className="reset-btn p-3 rounded-lg font-semibold text-white transition duration-200 shadow-md">
                    {isSuccess ? 'Ir a Iniciar Sesión' : 'Volver al Inicio'}
                </a>
            </div>
        </div>
    );
    
    // ----------------------------------------------------
    // RENDERIZADO PRINCIPAL
    // ----------------------------------------------------
    let content;

    switch (view) {
        case 'loading':
            content = (
                <div className="flex items-center justify-center p-12">
                     <svg className="animate-spin h-8 w-8 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <p className="ml-4 text-current font-medium">Cargando...</p>
                 </div>
            );
            break;
        case 'request':
            content = renderRequestView();
            break;
        case 'reset':
            content = renderResetView();
            break;
        case 'success':
            content = renderMessageView(true);
            break;
        case 'error':
            content = renderMessageView(false);
            break;
        default:
            content = renderRequestView();
    }

    return (
        // Uso de clases personalizadas para el tema oscuro
        <div className="reset-page">
            {/* Tarjeta de Contenido */}
            <div className="reset-container">
                <div className="reset-section">
                    {/* Botón de regreso usando <a> y SVG */}
                    <a href="/" className="reset-back-button">
                        {BackArrowSVG}
                    </a>
                    
                    {content}
                    
                    {/* Mensajes de Validación/Error en la parte inferior */}
                    {view !== 'success' && view !== 'error' && mensaje && (
                        <div className="mt-6 p-4 reset-validation-message" role="alert">
                            <p className="font-medium">{mensaje}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
