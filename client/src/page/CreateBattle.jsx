import React, { useState } from 'react';
import { GameLoad, CustomButton, CustomInput, PageHOC } from '../components';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { useGlobalContext } from '../context';


const CreateBattle = () => {
  const { contract, battleName, setBattleName, setShowAlert } = useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);
  
  const navigate = useNavigate();
  const handleClick = async () => {
    if(!battleName || !battleName.trim()) return null

    const battleNameExists = await contract.isBattle(battleName);
    if(battleNameExists === true ){
      setShowAlert({
        status: true,
        type: 'failure',
        message: 'Battle Already exist!'
      })
    }

    try {
      await contract.createBattle(battleName);
      setWaitBattle(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>{waitBattle && <GameLoad />}
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