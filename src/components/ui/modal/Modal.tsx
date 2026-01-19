'use client';
import { ReactNode } from 'react';
import styles from './modal.module.scss';
import { createPortal } from 'react-dom';

interface Props {
    children: ReactNode;
    open: boolean;
    onClose?: () => void;
}

const Modal = ({ children, open, onClose }: Props) => {
    if (!open) return null;
    return createPortal(
        <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-hidden="false"
        >
            <div
                className={styles.overlay}
                onClick={onClose}
                aria-label="Close modal"
            ></div>
            <div className={styles.content} tabIndex={-1}>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;