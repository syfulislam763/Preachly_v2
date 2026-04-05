import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useLayoutDimention from '../hooks/useLayoutDimention';
import { getStyles } from './SubscriptionPlanStyle';

const PlanSelector = ({OtherPlan=null, setSelectedPlanType, plan}) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold);

  
  const handlePlan = (label) => {
    console.log("hello")
    if(label=="monthly"){
      setSelectedPlanType(label)
    }else{
      setSelectedPlanType("yearly");
    }
    setSelectedPlan(label);
  }


  useEffect(()=>{
    if(plan=="yearly"){
      setSelectedPlan("annual")
    }else{
      setSelectedPlan(plan)
    }
  })

  return (
    <View>
      {/* Monthly Plan */}
      <TouchableOpacity
        style={[
          styles.planContainer,
          selectedPlan === 'monthly' && styles.selectedPlan,
        ]}
        onPress={() => handlePlan('monthly')}
      >
        <View>
          <Text style={styles.planTitle}>Monthly Plan</Text>
          <Text style={styles.subText}>7-Day Free Trial</Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.priceText}>$6.67 / Month</Text>
          <View style={[styles.radioOuter, selectedPlan === 'monthly' && styles.radioOuterSelected]}>
            {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>

      {OtherPlan&& OtherPlan()}

      {/* Annual Plan */}
      <TouchableOpacity
        style={[
          styles.planContainer,
          selectedPlan === 'annual' && styles.selectedPlan,
        ]}
        onPress={() => handlePlan('annual')}
      >
        <View>
          <Text style={styles.planTitle}>Annual Plan</Text>
          <Text style={styles.subText}>7-Day Free Trial</Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.priceText}>$79.99 / Year</Text>
          <View style={[styles.radioOuter, selectedPlan === 'annual' && styles.radioOuterSelected]}>
            {selectedPlan === 'annual' && <View style={styles.radioInner} />}
          </View>
        </View>

        {/* Save Badge */}
        {selectedPlan !== 'annual' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Save 44%</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PlanSelector;
