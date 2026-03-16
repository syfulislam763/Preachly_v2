import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const bird = require("../../assets/img/bird.png");
const bulb = require("../../assets/img/24-sunset.png");
const leaf = require("../../assets/img/24-leaf.png")
const book = require("../../assets/img/book_tone.png");
const rocket = require("../../assets/img/RocketLaunch.png");
const thunder = require("../../assets/img/thunder.png");

const tones = {
  "Clear and Hopeful": bulb,
  "Dynamic and Powerful": thunder,
  "Practical and Everyday": leaf,
  "Scholarly and Rational": book,
  "Encouraging and Purposeful": rocket,
  "Uplifting and Optimistic": bird,

  "Warm and Relatable": bulb,
  "Passionate and Empowering": thunder,

}

const useAppStore = create(
  persist(
    (set, get) => ({

      auth: {
        access: null,
        refresh: null,
        isLoggedIn: false,
        onboarding_completed: false,
        user: {
          email: null,
          name: null,
          social_auth_provider: null,
        },
      },

      setAuth: (authData) =>
        set((state) => {
          api.defaults.headers.common['Authorization'] = `Bearer ${authData.access}`;
          return {
            auth: {
              ...state.auth,
              access: authData.access,
              refresh: authData.refresh,
              isLoggedIn: authData.isLoggedIn ?? false,
              onboarding_completed: authData.onboarding_completed ?? false,
              user: {
                email: authData.user?.email ?? null,
                name: authData.user?.name ?? null,
                social_auth_provider: authData.user?.social_auth_provider ?? null,
              },
            },
          }
        }),

      setOnboardingCompleted: (value) =>
        set((state) => ({
          auth: { ...state.auth, onboarding_completed: value },
        })),

      logout: () => {
        delete api.defaults.headers.common['Authorization']; 
        //AsyncStorage.clear();
        return set({
          auth: {
            access: null,
            refresh: null,
            isLoggedIn: false,
            onboarding_completed: false,
            user: { email: null, name: null, social_auth_provider: null },
          },
          profile: useAppStore.getInitialState().profile,
          payment: useAppStore.getInitialState().payment,
          goal: useAppStore.getInitialState().goal,
          current_session: useAppStore.getInitialState().current_session
        })
      },

      deleteAccount: () => {
        delete api.defaults.headers.common['Authorization']; 
        AsyncStorage.clear();
        return set({
          auth: {
            access: null,
            refresh: null,
            isLoggedIn: false,
            onboarding_completed: false,
            user: { email: null, name: null, social_auth_provider: null },
          },
          profile: useAppStore.getInitialState().profile,
          payment: useAppStore.getInitialState().payment,
          goal: useAppStore.getInitialState().goal,
          current_session: useAppStore.getInitialState().current_session,
          ui: useAppStore.getInitialState().ui
        })
      },

      onboarding: {
        denominations: [],
        bible_versions: [],
        tone_preference_data: [],
        faith_journey_reasons: [],
        bible_familiarity_data: [],
        faith_goal_questions: [],
      },

      setOnboardingData: (data) => {
        const denominations = [...(data.denominations ?? [])];
        if (!denominations.find((d) => d.id === 0)) {
          denominations.push({ id: 0, name: 'None', is_active: false, is_selected: false });
        }

        console.log("data -> ", JSON.stringify(data, null, 2))

        const faith_journey_reasons = (data.journey_reasons ?? []).map((item) => ({
          ...item,
          name: item.option,
        }));

        const bible_versions = (data.bible_versions ?? []).map((item) => ({
          ...item,
          name: item.title,
        }));

        const faith_goal_questions = (data.faith_goal_questions ?? []).map((item) => ({
          ...item,
          options: item.options.map((op) => ({ ...op, name: op.option })),
        }));

        const tone_preference_data = (data?.tone_preferences ?? []).map((item) => ({
          ...item,
          //icon: tones[item.title]
        }))


        set({
          onboarding: {
            denominations,
            bible_versions,
            tone_preference_data,
            faith_journey_reasons,
            bible_familiarity_data: data.bible_familiarity ?? [],
            faith_goal_questions,
          },
        });
      },

      profile: {
        userInfo: {
          name: null,
          date_of_birth: null,
          profile_picture: null,
          remove_profile_picture: false,
          email: ""
        },       
        denomination: {
          id: 0,
          name: "",
          is_active: false,
          is_selected: false
        },
        bible_version: {
          id: 0,
          title: "",
          subtitle: "",
          api_bible_id: "",
          is_active: false,
          is_selected: false,
          name: ""
        },
        tone_preference: {
          id: 0,
          title: "",
          name: "",
          description: "",
          quote: "",
          icon: 0,
          is_active: false,
          is_selected: false
        },
        faith_reason: {
          id: 0,
          option: "",
          is_active: false,
          is_selected: false,
          name: ""
        },
        bible_familiarity: {
          id: 0,
          label: "",
          text1: "",
          text2: "",
          title: "",
          name: "",
          caption: "",
          is_active: false,
          is_selected: false
        },
        goal_preference: {
          id: 0,
          goal_type: "",
          goal_display: "",
          target_count: 0,
          current_count: 0,
          completed: false,
          progress_percentage: 0,
          week_start: "",
          week_end: "",
          days_remaining: 0,
          created_at: "",
          name: ""
        },
        dashboard: {
          streak: {},
          badges: [],
          available_weekly_checkins: 0,
          total_weekly_checkins_completed: 0
        },     
      },

      setProfileData: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data },
        })),

      setDashboard: (dashboard) =>
        set((state) => ({
          profile: { ...state.profile, dashboard },
        })),

      resolveProfileSettings: (onboardingUserData, userInfo, dashboardData) => {
        const { onboarding } = get();

        const goals = {
          conversation: 'Confidence Goal',
          scripture: 'Scripture Knowledge',
          share_faith: 'Inspiration Goal',
        };

        const find = (list, id) => list.find((item) => item.id === id) ?? {};

        const denomination = find(
          onboarding.denominations,
          onboardingUserData?.denomination?.denomination_option
        );
        const bible_version = find(
          onboarding.bible_versions,
          onboardingUserData?.bible_version?.bible_version_option
        );
        const tone_preference = find(
          onboarding.tone_preference_data,
          onboardingUserData?.tone_preference?.tone_preference_option
        );
        const faith_reason = find(
          onboarding.faith_journey_reasons,
          onboardingUserData?.journey_reason?.journey_reason
        );
        const bible_familiarity = find(
          onboarding.bible_familiarity_data,
          onboardingUserData?.bible_familiarity?.bible_familiarity_option
        );
        const goal_preference = {
          ...onboardingUserData?.goal_preference,
          name: goals[onboardingUserData?.goal_preference?.goal_type] ?? '',
        };

        const faith_goal_questions = (onboardingUserData?.faith_goals ?? []).map((item) => ({
          ...item,
          options: item.options.map((op) => ({ ...op, name: op.option })),
        }));

        set((state) => ({
          profile: {
            ...state.profile,
            userInfo: userInfo ?? {},
            denomination,
            bible_version,
            tone_preference,
            faith_reason,
            bible_familiarity,
            goal_preference,
            dashboard: dashboardData ?? state.profile.dashboard,
          },
          onboarding: {
            ...state.onboarding,
            faith_goal_questions,
          },
        }));
      },



      payment: {
        has_subscription: false,
        status: 'free',
        can_make_request: false,
        revenuecat_user_id: null,
        monthly_prompts_used: 0,
        monthly_prompts_limit: 0,
        is_active: false,
      },

      setPayment: (paymentData) =>
        set({ payment: { ...paymentData } }),


      goal: {
        week_start: "",
        week_end: "",
        days_remaining: 0,
        goal: {
          goal_type: "",
          goal_display: "",
          current_count: 0,
          target_count: 0,
          completed: false,
          progress_percentage: 0
        },
        is_new_goal: false,
        week_number: 0
      },

      setCurrentGoal: (goalData) =>
        set({ goal: { ...goalData } }),


      ui: {
        isAuthLoading: false,
        isHomeLoading: false,
        isDailyLoading: false,
      },

      setLoading: (key, value) =>
        set((state) => ({
          ui: { ...state.ui, [key]: value },
        })),


      current_session: {},

      setCurrentSession: (session) => {
        return set( (state) => ({
          current_session: {...state.current_session, ...session}
        }))
      },

      resetCurrentSession: () => {
        return set( (state) => ({
          current_session: useAppStore.getInitialState().current_session
        }))
      },
      session_history: {},

      setSessionHistory: (session) => {
        return set( (state) => ({
          session_history: {...session}
        }))
      }

    }),

    {
      name: 'preachly-store',
      storage: createJSONStorage(() => AsyncStorage),

    
      partialize: (state) => ({
        auth: {
          access: state.auth.access,
          refresh: state.auth.refresh,
          onboarding_completed: state.auth.onboarding_completed
        },
        onboarding: state.onboarding,
        profile: state.profile,
        payment: state.payment,
        goal: state.goal,
        current_session: state.current_session
      }),
    }
  )
);

export default useAppStore;