import background from "../../public/background2.jpg";
import yugi from "../../public/yugi.png"; 
import kaiba from "../../public/kaiba.png";
import collectionIcon from "../../public/card.png";
import marketIcon from "../../public/grandpere.png";
import profileIcon from "../../public/lewis.png";
import boosterIcon from "../../public/puzzle.png";
import logo from "../../public/logo.png"; 
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CollectionContext } from "@/context/CollectionContext";

export const Home = () => {
  let theme = new Audio("../../public/theme.mp3");
  let buttonhover = new Audio("../../public/button_hover.mp3")
  let buttonclick = new Audio("../../public/click.mp3")
  const [connected,isConnected] =useState<Boolean>(false)
  const navigate = useNavigate();
  const {currentAccount,connectWallet}= useContext(CollectionContext)
  
  useEffect(()=>{
    if(currentAccount){
      isConnected(true);
      // theme.play();
    }else{
      isConnected(false)
      connectWallet()
    }
  })

  const hoverButton =()=>{
    buttonhover.playbackRate = 4.0;
    buttonhover.play();
  }

  const holdButton = (destination : string)=>{
    buttonclick.playbackRate = 2.5;
    buttonclick.play();
    navigate(destination)
  }

  return (
    <div className="custom-cursor">
      {!connected && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 z-50">
              <h2 className="text-cyan-400 font-bold text-2xl mb-4 tracking-wider">
                Connectez-vous avec Metamask
              </h2>
              <p className="text-gray-300 mb-8 text-lg font-semibold">
                Pour accéder à toutes les fonctionnalités, connectez votre portefeuille Metamask.
              </p>
        </div>
      )}
      <div
        className="h-screen bg-cover bg-center bg-gradient-to-b from-blue-800 to-indigo-900" 
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="flex justify-center items-center w-full h-full relative">
          <div className="absolute left-20 z-10">
            <img
              src={yugi}
              alt="Yugi"
              className="w-3/5 glow-effect"
            />
          </div>

          <div className="bg-cover bg-center relative w-3/12 flex flex-col justify-start items-center p-4 z-20 ">
            
            <img src={logo} alt="Yu-Gi-Oh Logo" className="glow-effect w-11/12" /> 

            <button className="custom-button flex items-center mb-4 bg-gradient-to-b from-blue-800/70 to-indigo-900/20 w-4/5 glow-text" onClick={()=> holdButton("/Collection")} onMouseEnter={hoverButton}>
              <img src={collectionIcon} alt="Collections" className="icon-size mr-12 max-h-12 glow-effect" />
              Collections
            </button>
            <button className="custom-button flex items-center mb-4 bg-gradient-to-r from-blue-800/20 to-indigo-900/20 w-4/5 glow-text" onClick={()=> holdButton("/Market")} onMouseEnter={hoverButton}>
              <img src={marketIcon} alt="Market" className="icon-size mr-12 max-h-12 glow-effect" />
              Market
            </button>
            <button className="custom-button flex items-center mb-4 bg-gradient-to-b from-blue-800/20 to-indigo-900/20 w-4/5 glow-text" onClick={()=> holdButton("/Profile")} onMouseEnter={hoverButton}>
              <img src={profileIcon} alt="Profile" className="icon-size mr-12 max-h-12 glow-effect" />
              Profile
            </button>
            <button className="custom-button flex items-center bg-gradient-to-b from-blue-800/20 to-indigo-900/20 w-4/5 glow-text" onClick={()=> holdButton("/Boosters")} onMouseEnter={hoverButton}>
              <img src={boosterIcon} alt="Boosters" className="icon-size mr-12 max-h-12 glow-effect" />
              Boosters
            </button>
          </div>

          <div className="absolute right-10 z-10 flex justify-end">
            <img
              src={kaiba}
              alt="kaiba"
              className="w-3/5 glow-effect"
            />
          </div>
        </div>
      </div>

      <style>{`
        @font-face {
          font-family: 'YuGiOhFont';
          src: url('../../public/yu-gi-oh-matrix-bold.ttf') format('truetype');
        }

        .custom-button {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          padding: 10px 20px;
          border: 2px solid #3399ff;
          clip-path: polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%);
          transition: transform 0.3s, box-shadow 0.3s;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-family: 'YuGiOhFont', sans-serif;
        }

        .custom-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px #3399ff;
        }

        /* Glow effect for images */
        .glow-effect {
          filter: drop-shadow(0px 0px 20px white);
        }

        /* Glow effect for text */
        .glow-text {
          text-shadow: 0px 0px 20px white;
        }
        .custom-cursor {
          cursor: url('../../public/cursor.png'), auto; 
        }

      `}</style>
    </div>
  );
};
