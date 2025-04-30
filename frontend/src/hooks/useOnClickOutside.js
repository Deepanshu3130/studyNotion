import { useEffect } from "react";
export default function useOnClickOutside(ref , handler){
    useEffect(()=>{
        const listener = (event)=>{
            console.log("event triggered")
            if(!ref.current || ref.current.contains(event.target)){
                return;
            }
            handler(event);

          
            
        };
        // Add event listeners for mousedown and touchstart events on the document
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
    // useeffcet cleam up function
        return () =>{
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        }

    },[ref, handler])

}