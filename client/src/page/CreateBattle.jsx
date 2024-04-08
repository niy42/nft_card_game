import React, { useState, useEffect } from 'react';
import { GameLoad, CustomButton, CustomInput, PageHOC } from '../components';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components'

import styles from '../styles';
import { useGlobalContext } from '../context';


const CreateBattle = () => {
  const { 
    contract, 
    battleName, 
    setBattleName,
    setShowAlert,
    gameData,
    walletAddress,
  } = useGlobalContext();

  const [waitBattle, setWaitBattle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const navigate = useNavigate();
console.log('This is gameData', + ' ' + gameData?.activeBattle?.battleStatus === 0);
  useEffect(() => {
    setLoading(true);
    setLoadingMessage('Fetching Data . . .');
    if(gameData?.activeBattle?.battleStatus === 0){
      setWaitBattle(true);
    }
  }, [gameData]);


  const handleClick = async () => {
    if(!battleName || !battleName.trim()) return null

    setLoading(true)
    setLoadingMessage('Creating your Battle');

    try {
      const battleNameExists = await contract.isBattle(battleName);
      if(battleNameExists === true ){
        setShowAlert({
          status: true,
          type: 'failure',
          message: 'Battle Already exist!'
        })
        setLoading(false);
      }
      
      const createBattle = await contract.createBattle(battleName);
      if(createBattle){
        setWaitBattle(true);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>{loading && <Loader message={loadingMessage}/>}
      {waitBattle && <GameLoad />}
      <div className='flex flex-col mb-5'>
        {!loading && (
          <>
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
            restStyles='mt-6'/>

          </>
        )}
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