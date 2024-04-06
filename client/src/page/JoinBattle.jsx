import React, { useEfecct }from 'react'
import { PageHOC } from '../components'
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../context'
import styles  from '../styles'

const JoinBattle = () => {
  const navigate = useNavigate()
  return (
    <>
      <h2 className={styles.joinHeadText}>
        Available Battles
      </h2>
      <p className={styles.infoText} onClick={() => navigate('/create-battle')}>OR create a new battle</p>
    </>
  );
}

export default PageHOC(
    JoinBattle,
    <>Join <br /> a Battle</>,
    <>Join already exisiting battles</>
);
