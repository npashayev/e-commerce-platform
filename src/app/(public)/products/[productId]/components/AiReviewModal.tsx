import Modal from "@/components/ui/modal/Modal";
import styles from './ai-review-modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
    error: string | null;
    aiResponse: string | null;
    onRetry: () => void;
}

const AiReviewModal = ({
    isOpen,
    onClose,
    loading,
    error,
    aiResponse,
    onRetry
}: AiReviewModalProps) => {

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className={styles.aiReviewModal}>
                <div className={styles.header}>
                    <h2>AI Product Review</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className={styles.content}>
                    {loading && (
                        <div className={styles.loading}>
                            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
                            <p>Generating AI review...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className={styles.errorIcon} />
                            <p>{error}</p>
                            <button onClick={onRetry} className={styles.retryButton}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {aiResponse && !loading && !error && (
                        <div className={styles.markdownContent}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {aiResponse}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default AiReviewModal;