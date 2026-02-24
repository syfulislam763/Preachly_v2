import axios from "axios";
import api from "../../context/api";
import { BIBLE_BIBLE_VERSIONS, 
    SESSION_ID, 
    RANDOM_VERSE,
    CHECK_IN_HISTORY,
    WEEKLY_CHECK_IN_QUESTIONS,
    SAVE_CHECK_IN,
    ALL_GOAL,
    PROFILE_URL
 } from "../../context/Paths";


export const get_bible_versions = async (cb) => {
    try{
        const res = await api.get(BIBLE_BIBLE_VERSIONS);
        cb(res.data, true)
    }catch(e){
        cb(e, false)
    }
}


export const get_bible_books = async (payload, cb) => {
    const url = `/bible/${payload.version_id}/books/`;
    try{
        const res = await api.get(url);
        cb(res.data, true)
    }catch(e){
        cb(e, false)
    }
}


export const get_bible_books_chapter = async (payload, cb) => {
    const url = `/bible/${payload.version_id}/books/${payload.book_id}/chapters/`;
    try{
        const res = await api.get(url);
        cb(res.data, true)
    }catch(e){
        cb(e, false);
    }
}


export const get_bible_chapter_content = async(payload, cb) => {
    const url = `/bible/${payload.version_id}/chapters/${payload.chapter_id}/`;
    try{
        const res = await api.get(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const next_previous = async (payload, cb) => {
    
    const url = `/bible/${payload.version_id}/chapters/${payload.chapter_id}/${payload.route}/`

    try{
        const res = await api.get(url);
        cb(res.data, true)
    }catch(e){
        cb(e, false);
    }
}

export const search_bible = async (payload, cb) => {
    const url = `/bible/${payload.bibleId}/search/?query=${payload.query}&limit=${payload.limit}`;

    try{
        const res = await api.get(url);
        cb(res.data, true)
    }catch(e){
        cb(e, false);
    }
}

export const get_session_id = async (cb) => {
    try{
        const res = await api.post(SESSION_ID)
        cb(res.data, true)
    }catch(e){
        cb(e, false);
    }
}

export const bookmark_message = async (payload, cb) => {
    const url = `/chat/messages/${payload.message_id}/bookmark/`;
    try{
        const res = await api.post(url, {bookmark:payload.bookmark});
        cb(res.data, true)
    }catch(e){
        cb(e, false);
    }
}

export const get_message_by_session_id = async(session_id, cb) => {
    const url =  `/chat/sessions/${session_id}/`;
    try{
        const res = await api.get(url);
        cb(res?.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const get_all_sessions = async (cb) => {
    const url = `/chat/export/`;
    try{
        const res = await api.get(url);
        cb(res.data, true)
    }catch(e){
        cb(e, false);
    }
}

export const delete_session = async (session_id, cb) =>{
    const url =  `/chat/sessions/${session_id}/delete/`
    try{
        const res = await api.delete(url);
        cb(res.data, true);
    }catch(err){
        cb(err, false);
    }
}
export const make_favorite_session = async (payload, cb) =>{
    const url = `/chat/sessions/${payload.session_id}/favorite/`;
    try{
        const res = await api.post(url, {favorite: payload.favorite});
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}
export const get_bookmarked_message = async (cb) =>{
    const url = `/chat/messages/bookmarked/`;
    try{
        const res = await api.get(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const get_random_verses = async (cb) => {
    try{
        const res = await api.get(RANDOM_VERSE);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const get_weekly_check_in_history = async (cb) => {
    try{
        const res = await api.get(CHECK_IN_HISTORY);
        cb(res.data, true);
    }catch(e){
        cb(e,false)
    }
}

export const get_week_details_by_id = async (week_id, cb) => {
    const url =  `/checkin/weekly/history/${week_id}/`;
    try{
        const res = await api.get(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const get_weekly_check_in_questions = async(cb) =>{
    try{
        const res = await api.get(WEEKLY_CHECK_IN_QUESTIONS);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const save_weekly_check_in = async(payload, cb) => {
    try{
        const res = await api.post(SAVE_CHECK_IN, payload);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const get_calendar_information = async (payload, cb ) => {
    const url = `/checkin/calendar/?month=${payload.month}&year=${payload.year}`;

    try{
        const res = await api.get(url);
        cb(res.data, true );
    }catch(e){
        cb(e, false);
    }

}


export const get_all_goals = async (week, cb) =>{
    const url = `/goals/history/?weeks=${week}`
    try{
        const res = await api.get(url);
        cb(res.data,true)
    }catch(e){
        cb(e, false);
    }
}

export const finish_scripture = async (cb) => {
    const URL = `/goals/track/scripture/`;
    try{
        const res = await api.post(URL);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}
export const finish_conversation = async(cb) => {
    const URL = `/goals/track/conversation/`;
    try{
        const res = await api.post(URL);
        cb(res.data, true);
    }catch(e){
        console.log(JSON.stringify(e, null, 2), "show")
        cb(e, false);
    }
}


export const finish_share = async (cb) => {
    const URL = `/goals/track/share/`;
    try{
        const res = await api.post(URL);
        cb(res.data, true);
    }catch(e){
        cb(e, false)
    }
}

export const get_profile_dashboard_data = async (cb) => {
    try{
        const res = await api.get(PROFILE_URL);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const get_notifications = async (cb) => {
    const url = `/notifications/list/`;
    try{
        const res = await api.get(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const delete_notifications = async (id, cb) => {
    
    const url = `/notifications/list/${id}/`;
    try{
        const res = await api.delete(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const clear_all_notification = async (cb) => {
    const url = `/notifications/list/clear_all/`;
    try{
        const res = await api.delete(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const send_voice_message = async (payload, cb) => {
    const url = `/chat/voice-to-text/`;
    try{
        const res = await api.post(url, payload, {
            headers:{
                Accept: '*/*',
                "Content-Type": 'multipart/form-data',
            }
        });
        cb(res.data, true)
    }catch(e){
        cb(e, false);
    }
}

export const get_current_goal = async (cb) => {
    const url = `/goals/current-week/`;
    try{
        const res = await api.get(url);
        cb(res.data , true);
    }catch(e){
        cb(e, false)
    }
}

export const update_static_badge = async (cb) => {
    const url = `/checkin/badges/check-awards/`;
    try{
        const res = await api.post(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}

export const get_static_badge = async (cb) => {
    const url  = `/checkin/badges/my-badges/`;
    try{
        const res = await api.get(url);
        cb(res.data, true);
    }catch(e){
        cb(e, false);
    }
}