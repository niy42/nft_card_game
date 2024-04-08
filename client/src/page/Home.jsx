import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/index';
import { PageHOC, CustomInput, CustomButton, Loader } from '../components'; // Import LoadingSpinner
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state
  const [loadingMessage, setLoadingMessage] = useState(''); // Initialize loading message state
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      setIsLoading(true); // Set loading state to true before async operation
      setLoadingMessage('Registering player . . .'); // Set loading message

      console.log(walletAddress);
      const playerExists = await contract.isPlayer(walletAddress);
      if(!playerExists){
        await contract.registerPlayer(playerName, playerName);
        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is being summoned!`
        });
        navigate('/create-battle');
      }
    } catch (error) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: "Oops! something went wrong!"
      });
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading state to false after async operation
    }
  };

  /*useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAlert({
        status: true,
        type: 'info',
        message: 'Battle ready ??'
      });

    }, 9000)
    return () => clearTimeout(timeout);
  }, []);*/

  useEffect(() => {
    const checkForPlayerToken = async () => {
      setIsLoading(true); // Set loading state to true before async operation
      setLoadingMessage('Checking for player token . . .'); // Set loading message

      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);
      
      if(playerExists && playerTokenExists){
        navigate('/create-battle');
      } else {
        setShowAlert({
          status: true,
          type: 'failure',
          message: 'Please register player!'
        })
        setIsLoading(false); // Set loading state to false if navigation doesn't occur
      }
      
      console.log({
        playerExists,
        playerTokenExists
    });
  };
    
    if(contract){
      checkForPlayerToken();
    }
}, [contract, navigate, walletAddress]);

  return (
    <div className='flex flex-col'>
      {isLoading && <Loader message={loadingMessage} />} {/* Render Loader only when isLoading is true */}
      {!isLoading && (
        <>
          <CustomInput
            id="Name"
            label = "Name"
            placeholder = "Enter your player name"
            value={playerName}
            autocompleteValue='on'
            handleValueChange = {setPlayerName}
          />
          <CustomButton
            title="Register"
            handleClick={handleClick}
            restStyles="mt-6"
          />
        </>
      )}
    </div>
  );
};

export default PageHOC(
  Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game</>
);
