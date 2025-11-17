import {useEffect,useRef} from "react";
import confetti from "canvas-confetti";

function BreakModal({onClose}){
    const hasPlayedRef = useRef(false);

    useEffect(() => {
        if(!hasPlayedRef.current){
            const audio = new Audio("/chime.wav");
            audio.play().catch(err => console.log("Audio play failed:",err));
            hasPlayedRef.current = true;
        }

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

    function randomInRange(min,max){
        return Math.random()*(max-min)+min;
    }

    const interval = setInterval(function() {
         const timeLeft = animationEnd - Date.now();
         if(timeLeft <= 0){
            return clearInterval(interval);
         } confetti({
            ...defaults,
            origin: {x: randomInRange(0.1, 0.9), y:Math.random()-0.2}
         });
    }, 250);

    const timer = setTimeout(()=> {
        onClose();
    }, 5000);

    return()=> {
        clearInterval(interval);
        clearTimeout(timer);
    };

}, []);

return (   <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: "#30384b",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        border: "2px solid #4aec8c",
      }}
    >
      <h2 style={{ color: "#4aec8c", fontSize: "2rem", marginBottom: "20px" }}>
     Good Job!
      </h2>
      <p style={{ color: "#eee", fontSize: "1.5rem" }}>
        Let's take a break!
      </p>
    </div>
  </div>
); }

export default BreakModal;