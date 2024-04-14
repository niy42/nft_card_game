import { ethers } from 'ethers';
import { contractABI } from '../contract';
import { defenseSound } from '../assets';
import { playAudio, sparcle } from '../utils/animation'

const emptyAccount = '0x00000000000000000000000000000000000000000';


const AddNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter); // enables not to have multiple Listeners for the same event

    provider.on(eventFilter, (logs) => {
        const parsedLogs = (new ethers.utils.Interface(contractABI)).parseLog(logs)
        cb(parsedLogs);
    });
}

const getCoords = (cardRef) => {
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();


    return {
        pageX: left + width / 2,
        pageY: top + height / 2.25,

    }
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData, player1Ref, player2Ref }) => {
   
        try {
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
             
             
                 const BattleMoveEventFilter = contract.filters.BattleMove();
                 AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
                     console.log('Battle Move Initited: ', args);
                 });
             
                 const RoundEndedEvent = contract.filters.RoundEnded();
                 AddNewEvent(RoundEndedEvent, provider, ({ args }) => {
                     console.log('Round ended! ', args, walletAddress);
             
                     for(let i = 0; i < args.damagedPlayers.length; i++){
                         if(args.damagedPlayers[i] !== emptyAccount){
                             if(args.damagedPlayers[i] === walletAddress){
                                sparcle(getCoords(player1Ref));
                             } else if(args.damagedPlayers[i]  !== walletAddress){
                                sparcle(getCoords(player2Ref));
                             }
                         } else {
                             playAudio(defenseSound);
                         }
                     }
             
                     setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
                 });

                 const BattleEndedEventFilter = contract.filters.BattleEnded();
                 AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
                    console.log('Battle ended! ', args, walletAddress);

                    if(walletAddress.toLowerCase() === args.winner.toLowerCase()){
                        setShowAlert({
                            status: true,
                            type: 'success',
                            message: 'You won'
                        })
                    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()){
                        setShowAlert({
                            status: true,
                            type: 'failure',
                            message: 'You lost'
                        })

                        navigate('/create-battle');
                    }
                 });
                
             }

        } catch (error) {
            console.error(error);
        }
}  
    