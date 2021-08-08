import PropTypes from 'prop-types';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ error: {detail, title } }) => {
  return (
    <div className={styles.message}>
      <p key={detail}>{`${title}. ${detail}`}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  data: PropTypes.array
};

export default ErrorMessage;
