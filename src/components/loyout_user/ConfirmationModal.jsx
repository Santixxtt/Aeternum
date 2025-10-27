import React from 'react';

export default function ConfirmationModal({ title, message, onConfirm, onCancel }) {
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay-confirmation")) {
            onCancel();
        }
    };

    return (
        <div className="modal-overlay modal-overlay-confirmation" onClick={handleOverlayClick}>
            <div className="modal-content modal-content-confirmation">
                <button className="modal-close" onClick={onCancel}>
                    <i className="bx bx-x"></i>
                </button>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions-confirmation">
                    <button onClick={onCancel} className="btn-cancel">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="btn-confirm">
                        Sí, Quitar
                    </button>
                </div>
            </div>
        </div>
    );
}