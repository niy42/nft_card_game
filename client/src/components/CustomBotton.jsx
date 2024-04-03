import React from 'react'
import styles from '../styles'

const CustomBotton = ({ title, handleClick, restStyles }) => {
  return(
    <button
      type="button"
      className={`${styles.btn} ${restStyles}`}
      onClick={handleClick}
      title={title}
    > 
      Register
    </button>
  );
}

export default CustomBotton
