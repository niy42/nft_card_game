import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/index';
import { PageHOC, CustomInput, CustomBotton } from '../components';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
   const navigate = useNavigate();
   
  /*useEffect(() => {
        try {
            testModal();
            testWeb3();
        } catch (error) {
            console.error(error);
        }
    }, []);*/

  const handleClick = async () => {
    try {
      console.log(walletAddress);
      const playerExists = await contract.isPlayer(walletAddress);
      if(!playerExists){
        await contract.registerPlayer(playerName, playerName);
        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is being summoned!`
        })
      }
    } catch (error) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: "something went wrong!"
      })
      alert(error);
    }
  }

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if(playerExists && playerTokenExists){
        navigate('/create-battle');
      }

      console.log(playerExists);
      console.log(playerTokenExists);
    }
    
    setTimeout(() => {
      if(contract){
        checkForPlayerToken();
      }
    }, 12000)
  }, [contract]);

  return (
    <div className='flex flex-col'>
        <CustomInput
          id="Name"
          label = "Name"
          placeholder = "Enter your player name"
          value={playerName}
          autocompleteValue='on'
          handleValueChange = {setPlayerName}
        />

        <CustomBotton
          title="Register"
          handleClick={handleClick}
          restStyles="mt-6"
        />
    </div>
  )
};

export default PageHOC(
  Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game</>
);