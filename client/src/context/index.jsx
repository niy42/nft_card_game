import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
//import { useNavigate } from 'react-router-dom';

import { contractABI, contractAddress } from '../contract';
//import { createEventListeners } from './createEventListeners';

const { ethereum } = window;
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("");
    const [provider, setProvider] = useState("");
    const [contract, setContract] = useState("");
    const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: ''});

    /*const navigate = useNavigate();
    const checkCoreWallet = () => new Promise((resolve, reject) => {
        let timeout;
        let checkInterval; 

        const startChecking = async () => {
            try {
                checkInterval = setInterval(() => {
                 if(typeof ethereum != 'undefined'){
                     clearInterval(checkInterval);
                     clearTimeout(timeout);
                     resolve(true);
                 }
                }, 1000);
                
                timeout = setTimeout(() => {
                 clearInterval(checkInterval);
                 reject(new Error('Unable to initialize Core Wallet'))
                }, 60000);

            } catch (error) {
                console.error(error);
                reject(error);
            }
        };

        startChecking();

        // You might want to stop checking on window unload
        window.addEventListener('unload', () => {
            clearInterval(checkInterval),
            clearTimeout(timeout)
        })

    });*/

    /*const checkIfWalletIsConnected = async() => {
        try {
            if(!ethereum) alert("Please install Core Wallet!");
            const { request } = ethereum;
            await checkCoreWallet();
            const accounts = request({ method: "eth_accounts"});
            if(accounts.length){
                console.log(accounts, " connected to Core Wallet");
                setWalletAddress(accounts[0]);
                console.log(accounts[0], " is the current account");
            } else {
                console.log("No connected accounts!");
            }
        } catch (error) {
            console.error(error);
        }
    }*/
    
    useEffect(() => {
        updateCurrentWalletAddress();
        window?.ethereum?.on('accountChanged', updateCurrentWalletAddress);
    }, []);

    // Set the contract and provider to the state
    useEffect(() => {
        const setSmartContractandProvider = async() => {
            try {
                const { Contract, providers: { Web3Provider }} = ethers;
                const web3modal = new Web3Modal();
                const connection = await web3modal.connect();
                const newProvider = new Web3Provider(connection);
                const signer = newProvider.getSigner();
                const newContract = new Contract(contractAddress, contractABI, signer);

                setProvider(newProvider);
                setContract(newContract);
            } catch (error) {
                console.error(error);
            }
        };

        setSmartContractandProvider();
    }, []);

    useEffect(() => {
        if(contract){
            /*createEventListeners(
                contract, 
                provider, 
                walletAddress, 
                setShowAlert
            );*/

        }
    }, [contract])



    useEffect(() => {
        if(showAlert?.status){
            const timeout = setTimeout(() => {
                setShowAlert({status: false, type: 'info', message: ''})
            }, 5000)

            return () => clearTimeout(timeout);
        }  
    }, [showAlert]);

    // Set the wallet address to the state
    /*const updateCurrentWalletAddress = () => new Promise((resolve, reject) => {
        try {
            if(!ethereum){
                alert("Please install Core Wallet");
                return;
            }
            window?.ethereum?.request({ method: "eth_requestAccounts"})
            .then((accounts) => {
                console.log(accounts, " is/are authorized for connection");
                setWalletAddress(accounts[0]);
                console.log(accounts[0], " is the current account");
                resolve(accounts);
            }).catch((error) => {
                console.error(error);
                reject(new Error("Error: ", error));
            })
        } catch (error) {
            console.error(error);
            reject(error);
        }}
    );*/

    const updateCurrentWalletAddress = async () => {
        try {
            if(!ethereum) return alert("Please install Core");
            const accounts = await ethereum?.request({ method: "eth_requestAccounts"});
            if(accounts){
                setWalletAddress(accounts[0]);
                console.log(accounts[0], ' is the current account');
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    /*const testModal = () => {
        if(Web3Modal){
            console.log("Web3Modal is present in your application");
        } else {
            console.log("No presence of Web3Modal in your application");
        }
    };

    const testWeb3 = function(){
        (!ethereum) ? console.log('No Ethereum provider found in your application')
        : console.log('Ethereum provider is present in your application')
    };*/

    
    return (
        <GlobalContext.Provider value={{ 
            contract,
            walletAddress,
            showAlert,
            setShowAlert,
            }} >
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);
   