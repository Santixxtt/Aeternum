import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "../loyout_reusable/footer";
import "../../assets/css/dashboard_user.css";

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirigir si no hay token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Cargar datos del usuario
  useEffect(() => {
    cargarDatosUsuario();
    cargarPrestamos();
  }, []);

  const cargarDatosUsuario = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Error al cargar usuario");
      
      const data = await res.json();
      setUsuario(data);
      setFormData({
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        email: data.email || "",
        telefono: data.telefono || "",
      });
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarPrestamos = async () => {
    const token = localStorage.getItem("token");
    
    try {
      setPrestamos([]);
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Error al actualizar perfil");
      
      const data = await res.json();
      setUsuario(data);
      setEditMode(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-user">
        <Header onSearch={(q) => console.log(q)} onLogout={handleLogout} />
        <main>
          <div className="loading">
            <i className="bx bx-loader-alt bx-spin"></i>
            <p>Cargando perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-user">
      <Header
        onSearch={(q) => console.log("Buscar:", q)}
        onLogout={handleLogout}
      />

      <main>
        <section className="perfil-hero">
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal y revisa tus préstamos</p>
        </section>

        <hr />

        <div className="perfil-container">
          <section className="perfil-info">
            <div className="perfil-header">
              <div className="avatar">
                <i className="bx bx-user-circle"></i>
              </div>
              <h2>{usuario?.nombre} {usuario?.apellido}</h2>
              <p className="user-email">{usuario?.email}</p>
            </div>

            {!editMode ? (
              <div className="info-display">
                <div className="info-item">
                  <i className="bx bx-user"></i>
                  <div>
                    <label>Nombre completo</label>
                    <p>{usuario?.nombre} {usuario?.apellido}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="bx bx-envelope"></i>
                  <div>
                    <label>Email</label>
                    <p>{usuario?.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="bx bx-phone"></i>
                  <div>
                    <label>Teléfono</label>
                    <p>{usuario?.telefono || "No registrado"}</p>
                  </div>
                </div>
                <button
                  className="btn-edit"
                  onClick={() => setEditMode(true)}
                >
                  <i className="bx bx-edit"></i> Editar Perfil
                </button>
              </div>
            ) : (
              <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    <i className="bx bx-user"></i> Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <i className="bx bx-user"></i> Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <i className="bx bx-envelope"></i> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <i className="bx bx-phone"></i> Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    <i className="bx bx-save"></i> Guardar
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setEditMode(false)}
                  >
                    <i className="bx bx-x"></i> Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>

          <section className="prestamos-activos">
            <h2>
              <i className="bx bx-book-reader"></i> Mis Préstamos Activos
            </h2>
            {prestamos.length === 0 ? (
              <div className="empty-state">
                <i className="bx bx-book"></i>
                <p>No tienes préstamos activos</p>
                <button
                  className="cta-button"
                  onClick={() => navigate("/loyout_user/catalogo")}
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="prestamos-list">
                {prestamos.map((prestamo) => (
                  <div key={prestamo.id} className="prestamo-item">
                    <div className="prestamo-info">
                      <h3>{prestamo.libro_titulo}</h3>
                      <p>Fecha de préstamo: {prestamo.fecha_prestamo}</p>
                      <p>Fecha de devolución: {prestamo.fecha_devolucion}</p>
                    </div>
                    <button className="btn-devolver">
                      <i className="bx bx-undo"></i> Devolver
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}