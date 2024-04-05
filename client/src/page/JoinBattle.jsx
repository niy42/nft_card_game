import React, { useEfecct }from 'react'
import { PageHOC } from '../components'
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../context'
import styles  from '../styles'

const JoinBattle = () => {
  return (
    <div>
      Join Battle
    </div>
  )
}

export default PageHOC(
    JoinBattle,
    <>Join <br /> a Battle</>,
    <>Join already exisiting battles</>
);
