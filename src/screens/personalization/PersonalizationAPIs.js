
import { ONBOARDING_COMPLETE, BIBLE_FAMILIARITY, BIBLE_VERSION, DENOMINATION, FAITH_GOAL, JOURNEY_REASON, TONE_PREFERENCE, ONBOARDING_STATUS, ONBOARDING_OPTIONS,ONBOARDING_USER_DATA, ONBOARDING_ALL_DATA } from "../../context/Paths";

import api from "../../context/api";


export const journey_reason = async (payload, cb) => {
  try {
    //console.log("Journey Reason headers: ", api.defaults.headers);
    const response = await api.post(JOURNEY_REASON, payload);
    cb(response.data, true);
  
  } catch (error) {
    cb(error, false);
  }
}
export const get_journey_reason = async (cb) => {
  try{
    const res = await api.get(JOURNEY_REASON)
    cb(res.data, true)
  }catch(e){
    cb(e, false)
  }
}

export const bible_familiarity = async (payload, cb) => {
  try {
    const response = await api.post(BIBLE_FAMILIARITY, payload);
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}

export const get_bible_familiarity = async (cb) => {
  try{
    const res = await api.get(BIBLE_FAMILIARITY)
    cb(res.data, true)
  }catch(e){
    cb(e, false)
  }
}

export const bible_version = async (payload, cb) => {
  try {
    const response = await api.post(BIBLE_VERSION, payload);
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}
export const get_bible_version = async (cb) => {
  try{
    const res = await api.get(BIBLE_VERSION)
    cb(res.data, true)
  }catch(error){
    cb(error, false)
  }
}

export const denomination = async (payload, cb) => {
  try {
    const response = await api.post(DENOMINATION, payload);
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}
export const get_denomination = async (cb) => {
  try{
    const response = await api.get(DENOMINATION)
    cb(response.data, true)
  }catch(error){
    cb(error, false)
  }
}

export const faith_goal = async (payload, cb) => {
  try {
    const response = await api.post(FAITH_GOAL, payload);
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}
export const get_faith_goal = async (cb) => {
  try{
    const response = await api.get(FAITH_GOAL)
    cb(response.data, true)
  }catch(error){
    cb(error, false)
  }
}

export const tone_preference = async (payload, cb) => {
  try {
    const response = await api.post(TONE_PREFERENCE, payload);
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}
export const get_tone_preference = async(cb) => {
  try{
    const response = await api.get(TONE_PREFERENCE)
    cb(response.data, true)
  }
  catch (error){
    cb(error, false)
  }
}   

export const onboarding_complete = async (cb) => {
  try {
    const response = await api.post(ONBOARDING_COMPLETE);
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}

export const onboarding_status = async (access,cb) => {
  try {
    const response = await api.get(ONBOARDING_STATUS, {
      headers: {
        Authorization: `Bearer ${access}`
      },
      });
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}
export const onboarding_options = async (cb) => {
  try {
    const response = await api.get(ONBOARDING_OPTIONS);
    cb(response.data, true);

  } catch (error) {
    cb(error, false);
  }
}

export const get_onboarding_user_data = async(cb) => {
  try{
    const response = await api.get(ONBOARDING_USER_DATA);
    cb(response.data, true)
  }catch(error){
    cb(error, false)
  }
}

export const post_onboarding_user_data = async(payload, cb) => {
  try{  
    const response = await api.patch(ONBOARDING_USER_DATA, payload)
    cb(response.data, true)
  }catch(error){
    cb(error, false)
  }
}

export const get_onboarding_all_data = async(token, cb) => {
  try{
    const res = await api.get(ONBOARDING_ALL_DATA, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    cb(res.data, true)
  }catch(e){
    cb(e, false);
  }
}
