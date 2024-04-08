import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';

import { contractABI, contractAddress } from '../contract/index.js';
import { createEventListeners } from './createEventListeners.js';
const { ethereum } = window;
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: ''});
    const [battleName, setBattleName] = useState('');
    const [gameData, setGameData] = useState({
        players: [], pendingBattles: [], activeBattle: null
    });
    const [updateGameData, setUpdateGameData] = useState(0);
    const navigate = useNavigate();
    const [battleGround, setBattleGround] = useState('bg-astral');
     /*const updateCurrentWalletAddress = async () => {
        try {
            if(!ethereum) return alert('Please install wallet');
            const accounts = await window?.ethereum?.request({ method: "eth_requestAccounts" });
            if(accounts.length){
                setWalletAddress(accounts[0]);
                console.log(accounts[0], ' player account is set');
            }
        } catch (error) {
            console.error(error);
        }
    };*/



    // Set the wallet address to the state
    const updateCurrentWalletAddress = () => new Promise((resolve, reject) => {
        try {
            if(!ethereum){
                alert("Please install Core Wallet");
                return;
            }
            window?.ethereum?.request({ method: "eth_requestAccounts"})
            .then((accounts) => {
                console.log(accounts, " authorized connection");
                setWalletAddress(accounts[0]);
                console.log(accounts[0], " is set");
                resolve(accounts);
            }).catch((error) => {
                console.error(error);
                reject(new Error("Error: ", error));
            })
        } catch (error) {
            console.error(error);
            reject(error);
        }}
    );


    useEffect(() => {
        const waitForWalletConnection = async () => {
            let timeout;
            try {
                await updateCurrentWalletAddress();
            } catch (error) {
                console.error(error);
            }
            window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
            return () => clearTimeout(timeout);
        };

        const timeout = setTimeout(() => {
            waitForWalletConnection();
        }, 10000);
        
        return () => clearTimeout(timeout);
    }, []);
    
        
    // Set the contract and provider to the state
    useEffect(() => {
        const setSmartContractandProvider = () => new Promise((resolve, reject) => {
            try {
                
                const { Contract, providers: { Web3Provider }} = ethers;
                const web3modal = new Web3Modal({
                    network: "fuji",
                    cacheProvider: true
                });
                web3modal.connect().then((connection) => {
                    if(connection){
                        const newProvider = new Web3Provider(connection);
                        const signer = newProvider.getSigner();
                        const newContract = new Contract(contractAddress, contractABI, signer);
                        console.log("New contract instance:", newContract);

                        setProvider(newProvider);
                        setContract(newContract);
                        resolve(connection);
                    }
                }).catch((error) => {
                    console.error(error);
                    reject(new Error('unable to connect'));
                });
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
       
        const timeout = setTimeout(() => {
            setSmartContractandProvider();
        }, 0) 

        return () => clearTimeout(timeout);
    }, []);


    useEffect(() => {
        if(contract){
            createEventListeners({
                navigate,
                battleName,
                contract, 
                provider, 
                walletAddress, 
                setShowAlert,
                setUpdateGameData,
            });
        }
    }, [contract])


   useEffect(() => {
    let timeout;
    if(showAlert?.status){
        timeout = setTimeout(() => {
            setShowAlert({ status: false, type: '', message: ''});
        }, 5000);
        
        return () => clearTimeout(timeout);
    }

   }, [showAlert]);


  useEffect(() => {
    const fetchGameData = async () => {
        if(!contract || !walletAddress) return;
        try {
            const fetchedBattles = await contract.getAllBattles();
            console.log('Fetched Battles: ', fetchedBattles);

            const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus == 0);
            console.log('Pending Battles: ', pendingBattles);

            let activeBattle = null;
            fetchedBattles.forEach((battle) => {
                if(battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())){
                    if(battle.winner.startsWith('0x00')){
                        activeBattle = battle;
                    }
                }
            }) ;
            console.log('Player address: ', activeBattle);

            setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle })
        } catch (error) {
            console.error(error);
        }
    }

    fetchGameData();
        
   }, [contract, walletAddress]);

   /*useEffect(() => {
    const fetchGameData = async () => {
        if (!contract) return; //Ensure contract is initialized
        try {
            const fetchedBattles = await contract.getAllBattles();
            console.log("Fetched Battles: ", fetchedBattles);

            const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0);
            console.log("Pending Battles: ", pendingBattles);

            let activeBattle = null;
            for (const battle of fetchedBattles) {
                if (battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase()) &&
                    battle.winner.startsWith('0x00')) {
                    activeBattle = battle;
                    break; // Found active battle, exit loop
                }
            }

            setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    };

    fetchGameData();
}, [contract, updateGameData]);*/


    return (
        <GlobalContext.Provider value={{ 
            contract,
            walletAddress,
            showAlert,
            setShowAlert,
            battleName,
            setBattleName,
            setIsLoading,
            gameData,
            battleGround,
            setBattleGround,

            
            }} >
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);
   