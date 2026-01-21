'use client';

import { forwardRef, useActionState, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './card-details.module.scss';
import { checkoutAction, CheckoutActionState } from '@/app/actions/cart';
import { useRouter } from 'next/navigation';

interface CardDetailsProps {
  totalPrice: number;
  totalProducts: number;
  totalQuantity: number;
  onCheckoutSuccess: () => Promise<void>;
}

const CardDetails = forwardRef<HTMLInputElement, CardDetailsProps>(
  ({ totalPrice, totalProducts, totalQuantity, onCheckoutSuccess }, ref) => {
    const router = useRouter();

    const [formData, setFormData] = useState({
      cardholderName: '',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    });

    const [state, formAction, isPending] = useActionState<
      CheckoutActionState,
      FormData
    >(checkoutAction, {});

    const isCheckoutDisabled =
      Object.values(formData).some(value => value.trim() === '') ||
      totalProducts === 0;

    // Handle successful checkout
    useEffect(() => {
      if (state.success) {
        alert(state.message || 'Order placed successfully!');
        setFormData({
          cardholderName: '',
          cardNumber: '',
          expirationDate: '',
          cvv: '',
        });
        onCheckoutSuccess();
        router.refresh();
      }
    }, [state.success, state.message, onCheckoutSuccess, router]);

    // Handle errors
    useEffect(() => {
      if (state.error && !state.fieldErrors) {
        alert(state.error);
      }
    }, [state.error, state.fieldErrors]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      // Format card number with spaces
      if (name === 'cardNumber') {
        const formatted = value
          .replace(/\s/g, '')
          .replace(/(\d{4})/g, '$1 ')
          .trim();
        setFormData(prev => ({ ...prev, [name]: formatted }));
        return;
      }

      // Format expiration date
      if (name === 'expirationDate') {
        let formatted = value.replace(/\D/g, '');
        if (formatted.length >= 2) {
          formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
        }
        setFormData(prev => ({ ...prev, [name]: formatted }));
        return;
      }

      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (totalProducts === 0) {
        alert("You didn't add any products to your cart!");
        return;
      }

      // Show native browser confirmation
      if (
        confirm(
          `Are you sure you want to proceed with the checkout? Total: $${totalPrice.toFixed(2)}`,
        )
      ) {
        const fd = new FormData();
        fd.set('cardholderName', formData.cardholderName);
        fd.set('cardNumber', formData.cardNumber);
        fd.set('expirationDate', formData.expirationDate);
        fd.set('cvv', formData.cvv);
        formAction(fd);
      }
    };

    const getFieldError = (fieldName: string): string | undefined => {
      return state.fieldErrors?.[fieldName]?.[0];
    };

    return (
      <div className={styles.main}>
        <div className={styles.header}>Card Details</div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputCnr}>
            <label htmlFor="cardholderName">Name on card</label>
            <input
              ref={ref}
              id="cardholderName"
              type="text"
              value={formData.cardholderName}
              placeholder="John Doe"
              name="cardholderName"
              onChange={handleInputChange}
              required
              autoComplete="cc-name"
            />
            {getFieldError('cardholderName') && (
              <span className={styles.error}>
                {getFieldError('cardholderName')}
              </span>
            )}
          </div>

          <div className={styles.inputCnr}>
            <label htmlFor="cardNumber">Card number</label>
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              name="cardNumber"
              onChange={handleInputChange}
              required
              maxLength={19}
              autoComplete="cc-number"
            />
            {getFieldError('cardNumber') && (
              <span className={styles.error}>
                {getFieldError('cardNumber')}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputCnr}>
              <label htmlFor="expirationDate">Expiration date</label>
              <input
                id="expirationDate"
                type="text"
                placeholder="MM/YY"
                value={formData.expirationDate}
                name="expirationDate"
                onChange={handleInputChange}
                required
                maxLength={5}
                autoComplete="cc-exp"
              />
              {getFieldError('expirationDate') && (
                <span className={styles.error}>
                  {getFieldError('expirationDate')}
                </span>
              )}
            </div>
            <div className={styles.inputCnr}>
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                name="cvv"
                onChange={handleInputChange}
                required
                maxLength={4}
                autoComplete="cc-csc"
              />
              {getFieldError('cvv') && (
                <span className={styles.error}>{getFieldError('cvv')}</span>
              )}
            </div>
          </div>

          <div className={styles.totalInfo}>
            <div className={styles.infoCnr}>
              <span>Total price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.infoCnr}>
              <span>Total products:</span>
              <span>{totalProducts}</span>
            </div>
            <div className={styles.infoCnr}>
              <span>Total quantity:</span>
              <span>{totalQuantity}</span>
            </div>
          </div>

          <button
            className={styles.checkoutBtn}
            disabled={isCheckoutDisabled || isPending}
            type="submit"
          >
            {isPending ? (
              <>
                Processing <FontAwesomeIcon icon={faSpinner} spin />
              </>
            ) : (
              <>
                Checkout <FontAwesomeIcon icon={faArrowRight} />
              </>
            )}
          </button>
        </form>
      </div>
    );
  },
);

CardDetails.displayName = 'CardDetails';

export default CardDetails;
