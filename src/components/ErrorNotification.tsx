import React from 'react';

interface ErrorNotificationProps {
  error: string;
  onClose: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onClose,
}) => (
  <div data-cy="ErrorNotification" className="notification is-danger is-light">
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClose}
    />
    {error}
  </div>
);

export default ErrorNotification;
