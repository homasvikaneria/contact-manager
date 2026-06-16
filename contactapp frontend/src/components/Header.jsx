import React from 'react'

const Header = ({toggleModal, nbOfContacts, onLogout}) => {
  const username = localStorage.getItem("username") || "User";

  return (
    
    <header className="header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Contact List ({nbOfContacts})</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--spooky-black-1)' }}>
                    <i className="bi bi-person-circle" style={{ marginRight: '5px', fontSize: '18px', color: 'var(--selective-blue)' }}></i>
                    Hi, {username}
                </span>
                <button onClick={()=> toggleModal(true)} className="btn">
                    <i className="bi bi-plus-square"></i>
                    Add New Contact     
                </button>
                <button onClick={onLogout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                </button>
            </div>
        </div>
    </header>
  )
}

export default Header