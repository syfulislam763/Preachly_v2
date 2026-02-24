import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import {
  initPaymentSheet,
  presentPaymentSheet,
  retrieveSetupIntent,
} from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';
import { ROOT_URL } from '../../../../context/Paths';
import api from '../../../../context/api';
import { handleToast } from '../../../auth/AuthAPI';

const headers = {
  Authorization: 'Bearer YOUR_LOGIN_TOKEN', // 🔁 Replace with actual auth token
  'Content-Type': 'application/json',
};

export default function createPlan() {
  const navigation = useNavigation();

  const [plans, setPlans] = useState([]);
  const [selectedPlanType, setSelectedPlanType] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [setupIntentId, setSetupIntentId] = useState(null);
  const [monthlyPlan, setMonthlyPlan] = useState(null);
  const [yearlyPlan, setYearlyPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);


  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/subscription/setup/check-plans/`);
      if (res.data.success) {
        const data = res.data.data;
        let month, year;
        const temp = [...data.plans]
        temp.forEach(item => {
            if(item.interval == "month"){
                month = item;
            }else{
                year = item;
            }
        })
        

        setPlans(data.plans);
        setMonthlyPlan(month);
        setYearlyPlan(year)
        if (data.plans.some((p) => p.plan_type === 'explorer_yearly')) {
          setSelectedPlanType('yearly');
        } else if (data.plans.length > 0) {
          setSelectedPlanType(
            data.plans[0].plan_type.includes('monthly') ? 'monthly' : 'yearly'
          );
        }
      } else {
        console.log('Error', 'Failed to load subscription plans');
      }
    } catch (err) {
      //Alert.alert('Error', 'Failed to fetch plans');
      console.error('Plans error:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };


  return {
    setSelectedPlanType,
    selectedPlanType,
    monthlyPlan,
    yearlyPlan,
  }

}
