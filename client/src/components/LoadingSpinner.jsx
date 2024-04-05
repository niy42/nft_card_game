import styles from "../styles";

const Loader = function(){
    return(
        <div className="flex justify-center items-center py-3 mt-6">
           
            <div className="animate-pulse ">
                 <p className={`${styles.loadingText} items-center justify-center py-3`}>
                    Loading Your Ultimate Battle Ground
                </p>
                <div>
                    <>
                        <div className='dot1 mov'></div>
                        <div className='dot1 mov'></div>
                        <div className='dot1 mov'></div>
                        <div className='dot1 mov'></div>
                        <div className='dot1 mov'></div>
                    </> 
                </div>
                 
            </div>
       </div>
    );
}
export default Loader;