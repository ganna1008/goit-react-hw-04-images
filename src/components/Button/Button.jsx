import css from './Button.module.css';
import PropTypes from 'prop-types';

export const Button = ({ nextPage, countTotalImg }) => {
  const handleOnClick = () => {
    nextPage();
    countTotalImg();
  };
  return (
    <button className={css.button} type="button" onClick={handleOnClick}>
      Load more
    </button>
  );
};

Button.propTypes = {
  nextPage: PropTypes.func.isRequired,
};
