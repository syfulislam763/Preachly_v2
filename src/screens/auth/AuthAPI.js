import axios from "axios";
import { ROOT_URL, SIGNUP, VERIFY_EMAIL, RESEND_OTP, CREATE_PASS, LOGIN, SOCIAL_LOGIN , PROFILE_UPDATE, VERIFY_CHANGE_EMAIL, DELETE_URL} from "../../context/Paths";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
 

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import api from "../../context/api";


GoogleSignin.configure({
    iosClientId: "286524043496-h57vncf5idoravbdl2fel472uh1ammda.apps.googleusercontent.com",
    webClientId:"286524043496-8d6eg6u0ailph7gosrvhm418er820j3s.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
    offlineAccess: true,
});

export const googleSignIn = async (cb) => {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            cb(response.data, true)
        } else {
            cb(response.data, false)
        }
    } catch (error) {
        cb(error, false)
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                console.log(error.message, "a")
                break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                console.log(error.message, "b")
                break;
                default:
                console.log(error, "c")
                console.log(error.code, error.message, error.name, error.cause)
            }
        } else {
            console.log("something else")
        }
    }
};

export const googleSignOut = async (cb) => {
    try {
        await GoogleSignin.signOut();
        cb(true)
    } catch (error) {
        cb(false)
    }
};


export const handleToast = (type, msg,duration=1000, goTo, show=()=>{}) => {
    Toast.show({
        type: type, 
        text1: type,
        text2: msg,
        visibilityTime: duration,
        position: 'top',
        onHide: () => goTo(),
        onShow: () => show()
    })
}


export const sign_up = async (payload, cb) => {
    try{
        const response = await axios.post(ROOT_URL+SIGNUP, payload)
        cb(response.data, true)
    }catch(error){
        cb(error, false)
    }
}

export const delete_account = async (payload, cb) => {
    try{
        const response = await api.post(DELETE_URL, payload)
        cb(response.data, true)
    }catch(error){
        cb(error, false)
    }
}

export const verify_email = async (payload, cb) => {
    try{
        const res = await axios.post(ROOT_URL+VERIFY_EMAIL, payload)
        const data = res.data
        cb(data, true)
    }catch(error){
        cb(error, false)
    }
}

export const resentOTP = async (payload, cb) => {
    try{
        const res = await axios.post(ROOT_URL+RESEND_OTP, payload)
        const data = res.data
        cb(data, true)
    }catch(error){
        cb(error, false)
    }
}

export const create_password = async (payload, cb) => {
    try{
        const res = await axios.post(ROOT_URL+CREATE_PASS, payload)
        const data = res.data
        cb(data, true)
    }catch(error){
        
        cb(error, false)
    }
}

export const login = async (payload, cb) => {
    try{
        const res = await axios.post(ROOT_URL+LOGIN, payload)
        const data = res.data
        cb(data, true)
    }catch(error){
        cb(error, false)
    }
}
export const googleLogin = async (payload, cb) => {
    try{
        console.log(payload)
        const res = await axios.post(ROOT_URL+SOCIAL_LOGIN, payload,{
            headers:{
                'Content-Type':'application/json',
                'X-CSRFTOKEN': 'L5lIgvX3eVyHzQ3Rp547wKsPR1KaeCMfFnk7kjy7YuV7Zf1y3n5BrKgB34oRagh4'
            }
        })
        const data = res.data
        cb(data, true)
    }catch(error){
        cb(error, false)
    }
}


export const get_profile_info = async(cb) => {
    // console.log("header ->", api.defaults.headers.common )
    try{
        const res = await api.get(PROFILE_UPDATE)
        cb(res.data, true)
    }catch(e){cb(e, false)}
}


export const update_profile_info = async(payload, token, cb) => {
    try{
        const response = await fetch(`${ROOT_URL}${PROFILE_UPDATE}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type - let fetch handle it
            },
            body: payload // FormData
        });
        
        const data = await response.json();

        if (response.ok) {
            cb(data, true);
        } else {
            cb(data, false);
        }
    }catch(e){
        cb(e, false)
    }


    // try{
    //     const res = await api.patch(PROFILE_UPDATE, payload, {
    //         headers:{
    //             Accept: '*/*',
    //             "Content-Type": 'multipart/form-data',
    //         },
    //         transformRequest: (data, headers) => {
    //             return data
    //         }
    //     })
    //     cb(res.data, true)
    // }catch(e){
    //     console.log(e.message, e)
    //     cb(e, false)
    // }
}

export const verify_change_email = async(payload, cb) => {
    try{
        const res = await api.post(VERIFY_CHANGE_EMAIL, payload)
        cb(res.data, true)
    }catch(error){
        cb(error, false)
    }
}

export const get_payment_status = async (token, cb) => {
    const url = `/subscription/revenuecat/status/`;
    try{
        const res = await api.get(url,{
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}


export const forget_password = async (payload, cb) => {
    const url = ROOT_URL+`/auth/password/reset-request/`
    try{
        const res = await axios.post(url, payload);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const verify_forget_password = async (payload, cb) => {
    const url = ROOT_URL+`/auth/password/reset-verify-otp/`;
    try{
        const res = await axios.post(url, payload);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }

}

export const confirm_forget_password = async (payload, cb) => {
    const url = `/auth/password/reset-confirm/`;
    try{
        const res = await api.post(url, payload);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}



