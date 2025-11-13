export function PerfilComponent() {
  return (
    <>
      <h2>Mi Perfil</h2>
      <h4>Información personal</h4>
      <p>Configura tu perfil y preferencias.</p>
      
      <div style={{ marginTop: '30px' }} className="form-container">
        <label className="form-label">Nombre de usuario</label>
        <input type="text" className="form-input" placeholder="Tu nombre" />
        
        <label className="form-label" style={{ marginTop: '15px' }}>Email</label>
        <input type="email" className="form-input" placeholder="tu@email.com" />
      </div>
    </>
  )
}
export default PerfilComponent