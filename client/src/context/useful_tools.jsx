    /*const navigate = useNavigate();
    /*const checkCoreWallet = () => new Promise((resolve, reject) => {
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

    
      /*useEffect(() => {
        if(showAlert?.status){
            const timeout = setTimeout(() => {
                setShowAlert({status: false, type: 'info', message: ''})
            }, 5000)

            return () => clearTimeout(timeout);
        }  
    }, [showAlert]);*/