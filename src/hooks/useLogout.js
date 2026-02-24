import { View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../context/api";
import { handleToast } from "../screens/auth/AuthAPI";
import { useCallback, useEffect } from "react";
import { get_profile_info } from "../screens/auth/AuthAPI";
import { useFocusEffect } from "@react-navigation/native";
import { get_random_verses } from "../screens/tabs/TabsAPI";

const useLogout = () => {
    const {logout, updateStore} = useAuth()

    const login_again = () => {
        get_profile_info((res,success) => {
            if(success){
                //updateStore({random_verse:res?.data?.data})
                //console.log(JSON.stringify(res.data.data, null, 2))
            }
            else if(!success && res.response.status === 401){
                handleToast("error", "Session expired. Please login again.", 2000, () => {
                    logoutUser(() => {
                    logout();
                    }, () => {
                        
                    });
                });
            }else{

            }
        })
        
    }

    useFocusEffect(
        useCallback(() => {
            login_again()
        }, [])
    )

    // useEffect(() => {
        
    // }, [])


}


export default useLogout