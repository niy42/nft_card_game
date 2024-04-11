import { ethers } from 'ethers';
import { contractABI } from '../contract';



const AddNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter); // enables not to have multiple Listeners for the same event

    provider.on(eventFilter, (logs) => {
        const parsedLogs = (new ethers.utils.Interface(contractABI)).parseLog(logs)
        cb(parsedLogs);
    });
}


export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert,setUpdateGameData }) => {
    if(contract && contract.filters){
         const  NewPlayerEventFilter = contract.filters.NewPlayer();
              
         AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
            console.log('New player created', args);
            
            if(walletAddress === args.owner){
                setShowAlert({
                status: true,
                type: 'success',
                message: 'Player has been successfully registered'})
            }
        })

        const  NewBattleEventFilter = contract.filters.NewBattle();
        AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
            console.log('New battle started!', args, walletAddress);

            if(walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()){
                navigate(`/battle/${args.battleName}`);
            }

            setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
            
        });


        //const Battle

    } else {
        console.log("Object doesn't exists");
    }
}