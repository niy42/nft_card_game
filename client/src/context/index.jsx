import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
//import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import { contractABI, contractAddress } from '../contract/index.js';
//import { createEventListeners } from './createEventListeners';
const { ethereum } = window;
const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("");
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: ''});

    

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
        }, 3000);
        
        return () => clearTimeout(timeout);
    }, []);
    
    
    useEffect(() => {
        const message = () => {
            try {
                setShowAlert({
                    status: true,
                    type: 'info',
                    message: 'Almost there... Brave men don\'t quit'
                })
                if(showAlert?.status) showAlert?.status 
                && <Alert type={showAlert.type} message={showAlert.message}/>      

        } catch (error) {
                console.error(error);
            }
        }
        
        const timeout = setTimeout(() => {
            message();
        }, 15000);

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
        }, 20000) 

        return () => clearTimeout(timeout);
    }, []);



    /*useEffect(() => {
        if(contract){
            /*createEventListeners(
                contract, 
                provider, 
                walletAddress, 
                setShowAlert
            );

        }
    }, [contract])*/


   useEffect(() => {
    let timeout;
    if(showAlert?.status){
        timeout = setTimeout(() => {
            setShowAlert({ status: false, type: '', message: ''});
        }, 5000);
        
        return () => clearTimeout(timeout);
    }

   }, [showAlert]);


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
   