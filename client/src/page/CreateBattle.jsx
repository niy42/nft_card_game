import React, { useEffect } from 'react';
import { CustomButton, CustomInput, PageHOC } from '../components';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { useGlobalContext } from '../context';


const CreateBattle = () => {
  const { battleName, setBattleName } = useGlobalContext();
  const navigate = useNavigate();
  const handleClick = () => {}

  return (
    <>
      <div className='flex flex-col mb-5'>
        <CustomInput 
          id='name'
          label='name'
          placeholder='Enter battle name'
          value={battleName}
          autocompleteValue='on'
          handleValueChange={setBattleName}
          
          />
        <CustomButton 
          title='Create Battle'
          handleClick={handleClick}
          restStyles='mt-6'
        />
        <p className={styles.infoText} onClick={() => navigate('/join-battle')}>or join an existing Battle</p>
      </div>
    </>
  )
};

export default PageHOC(
  CreateBattle,
  <>Create <br /> a new battle</>,
  <>Create your own battle and wait for other players to join you </>
);