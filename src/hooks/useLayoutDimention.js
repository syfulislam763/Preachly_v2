import { useEffect, useState } from "react";
import { Dimensions } from "react-native";


export default function useLayoutDimention () {
    const [windowInfo, setWindowInfo] = useState(Dimensions.get('window'))
    useEffect(()=>{
        const onChange = (result) => {
            setWindowInfo(result.window)
        }

        const event = Dimensions.addEventListener('change',  onChange);


        return () => event.remove()

    }, [])


    return {
        ...windowInfo,
        isSmall: (windowInfo.width<=360) && "small",
        isMedium: (windowInfo.width <= 414) && "medium",
        isLarge: (windowInfo.width<768) && "large",
        isFold: (768 < windowInfo.width) && "fold"
    }
}

