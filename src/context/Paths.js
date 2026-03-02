
// export const BASE_URL = "https://bibel-project.onrender.com"
export const BASE_URL = "https://api.preachly.app";//changed
export const WEBSOCKET_URL = "wss://api.preachly.app";
export const KEY = `pk_test_51RVMTHQU9tGM4LXBf8ZHLjC18DYzzWu4HnxSCojMGP58ZO8x1K2sFbNZ5xGLmIRt6KjZpo77V0RKs4m6dwoxoFLi00u06pnafX`

export const URL_CATEGORY = "/api"
export const ROOT_URL = BASE_URL+URL_CATEGORY

//Authentication API
export const TOKEN_URL = "/auth/token/refresh/"

export const SIGNUP = "/auth/register/initiate/"
export const VERIFY_EMAIL = "/auth/verify-email/"
export const RESEND_OTP = "/auth/resend-otp/"
export const CHANGE_PASSWORD = "/auth/password/change/"
export const LOGIN = "/auth/login/"
export const CREATE_PASS = "/auth/register/complete/"
export const SOCIAL_LOGIN = "/auth/social-auth/"

//Onboarding API
export const ONBOARDING = "/onboarding"

export const JOURNEY_REASON = ONBOARDING+"/journey-reason/"
export const DENOMINATION = ONBOARDING+"/denomination/"
export const FAITH_GOAL = ONBOARDING+"/faith-goals/"
export const FAITH_PREFERENCE = ONBOARDING+"/faith-preference/"
export const BIBLE_VERSION = ONBOARDING+"/bible-version/"
export const BIBLE_FAMILIARITY = ONBOARDING+"/bible-familiarity/"
export const TONE_PREFERENCE = ONBOARDING+"/tone-preference/"
export const ONBOARDING_COMPLETE = ONBOARDING+"/complete/"
export const ONBOARDING_STATUS = ONBOARDING+"/status/"
export const ONBOARDING_OPTIONS = ONBOARDING+"/options/"
export const ONBOARDING_USER_DATA = ONBOARDING+"/user-data/"
export const ONBOARDING_ALL_DATA =  ONBOARDING+"/options/"

//Profile API
export const PROFILE_UPDATE = "/auth/profile/update/"
export const VERIFY_CHANGE_EMAIL = "/auth/profile/verify-email-change/"


//Bible
export const BIBLE_BIBLE_VERSIONS = "/bible/bible-versions/"

//Chat
export const SESSION_ID = "/chat/sessions/create/"

//Home page
export const RANDOM_VERSE = "/homepage/daily-verse/";

//Weekly Check in
export const CHECK_IN_HISTORY = "/checkin/weekly/history/";
export const WEEKLY_CHECK_IN_QUESTIONS = "/checkin/weekly/questions/";
export const SAVE_CHECK_IN = "/checkin/weekly/submit/"
export const PROFILE_URL = "/checkin/dashboard/"
export const ALL_GOAL = "/goals/stats/"
export const DAILY_CHECK_IN = "/checkin/daily/"