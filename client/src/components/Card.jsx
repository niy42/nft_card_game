import React from 'react';
import Tilt from 'react-parallax-tilt';


import styles from '../styles';
import { allCards } from '../assets';

const generateRandomCardImage = () => allCards[Math.floor(Math.random() * (allCards.length - 1))];

const img1 = generateRandomCardImage();
const img2 = generateRandomCardImage();


const Card = ({ card, title, restSytles, cardRef, playerTwo }) => {
  return (
    <div  className={`${styles.cardContainer} ${restSytles}`}>
      <img src={playerTwo ? img2 : img1} alt='card' className={styles.cardImg} />
      
      <div className={`${styles.cardPointContainer} sm:left-[21.2%] left-[22%] ${styles.flexCenter}`}>
        <p className={`${styles.cardPoint} text-yellow-400`}>{card.att}</p>
      </div>

      <div className={`${styles.cardPointContainer} sm:right-[14.2%] right-[15%] ${styles.flexCenter}`}>
        <p className={`${styles.cardPoint} text-red-800`}>{card.att}</p>
      </div>
    </div>
  )
}

export default Card
