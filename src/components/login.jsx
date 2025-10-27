import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/img/login.jpg";
import "../assets/css/login-module.css";

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(correo)) {
      setError("Formato de correo inválido");
      return;
    }

    if (clave.length < 4) {
      setError("La contraseña es muy corta");
      return;
    }

    try {
      // Llamada al backend de Python
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token en localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userRole", data.rol);
        localStorage.setItem("userData", JSON.stringify(data.user));

        alert("Inicio de sesión exitoso");
        // console.log("Token recibido:", data.access_token);

         if (data.rol === "bibliotecario") {
            navigate("/loyout_librarian/dashboard_librarian"); 
        } else if (data.rol === "usuario") {
            navigate("/loyout_user/dashboard_user"); 
        } 
      } else {
        setError(data.detail || "Error al iniciar sesión. Intentalo de nuevo."); 
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-section">
          <a href="/" className="login-back-button">
            <i className="bx bx-chevron-left"></i>
          </a>
          <h1>Inicio de Sesión</h1>
          <p>Inicia sesión con tu cuenta de <strong>Aeternum.</strong></p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label>Correo</label>
              <input
                type="email"
                placeholder="hey@tuemail.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="login-form-group password-wrapper">
              <label>Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "bx bx-hide" : "bx bx-show"}></i>
              </span>
            </div>

            <button type="submit" className="login-btn">
              Iniciar sesión
            </button>
          </form>

          <div className="login-register-options">
            <p>
              ¿No tienes cuenta? <a href="./register">Regístrate</a>
            </p>
            <p>
              ¿Se te olvido la contraseña? <a href="./restablecer-contrasena">¡Recuperala!</a>
            </p>
          </div>
        </div>

        <div className="login-image-section">
          <img src={loginImage} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
