import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useLayoutDimention from '../hooks/useLayoutDimention';
import { getStyles } from './SubscriptionPlanStyle';

/**
 * PlanSelector
 *
 * Props:
 *  - plan               'monthly' | 'yearly'   controlled from parent
 *  - setSelectedPlanType  (value) => void
 *  - monthlyPrice       string | null   e.g. "$11.99"  (from RevenueCat)
 *  - annualPrice        string | null   e.g. "$79.99"  (from RevenueCat)
 *  - monthlyTrialText   string | null   e.g. "7-day free trial"
 *  - annualTrialText    string | null   e.g. "7-day free trial"
 *  - OtherPlan          render-prop for an extra plan card (optional)
 */
const PlanSelector = ({
  OtherPlan = null,
  setSelectedPlanType,
  isSubscribed = false,
  plan,
  monthlyPrice = null,
  annualPrice = null,
  monthlyTrialText = null,
  annualTrialText = null,
}) => {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const { isSmall, isMedium, isLarge, isFold } = useLayoutDimention();
  const styles = getStyles(isSmall, isMedium, isLarge, isFold);

  // Sync internal state when parent changes `plan`
  useEffect(() => {
    if (plan === 'yearly') {
      setSelectedPlan('annual');
    } else {
      setSelectedPlan(plan ?? 'annual');
    }
  }, [plan]);

  const handlePlan = (label) => {
    if(isSubscribed) return;
    setSelectedPlan(label);
    // Normalise to 'monthly' | 'yearly' for the parent
    setSelectedPlanType(label === 'annual' ? 'yearly' : 'monthly');
  };

  // ─── Derive save-% badge ──────────────────────────────────────────────────
  const savingsLabel = getSavingsLabel(monthlyPrice, annualPrice);
  console.log("mon", monthlyTrialText, annualTrialText)

  return (
    <View>

      {/* ── Monthly Plan ── */}
      <TouchableOpacity
        style={[
          styles.planContainer,
          selectedPlan === 'monthly' && styles.selectedPlan,
        ]}
        onPress={() => handlePlan('monthly')}
        activeOpacity={0.85}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.planTitle}>Monthly Plan</Text>
          <Text style={styles.subText}>
            {monthlyTrialText}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.priceText}>
            {monthlyPrice ? `${monthlyPrice} / Month` : '$11.99 / Month'}
          </Text>
          <View style={[
            styles.radioOuter,
            selectedPlan === 'monthly' && styles.radioOuterSelected,
          ]}>
            {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>

      {/* Optional extra plan slot */}
      {OtherPlan && OtherPlan()}

      {/* ── Annual Plan ── */}
      <TouchableOpacity
        style={[
          styles.planContainer,
          selectedPlan === 'annual' && styles.selectedPlan,
        ]}
        onPress={() => handlePlan('annual')}
        activeOpacity={0.85}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.planTitle}>Annual Plan</Text>
          <Text style={styles.subText}>
            {annualTrialText}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.priceText}>
            {annualPrice ? `${annualPrice} / Year` : '$79.99 / Year'}
          </Text>
          <View style={[
            styles.radioOuter,
            selectedPlan === 'annual' && styles.radioOuterSelected,
          ]}>
            {selectedPlan === 'annual' && <View style={styles.radioInner} />}
          </View>
        </View>

        {/* Save badge — only shown when annual is NOT selected */}
        {(selectedPlan !== 'annual' && !isSubscribed) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{savingsLabel}</Text>
          </View>
        )}
      </TouchableOpacity>

    </View>
  );
};

// ─── Helper: calculate savings % from real prices ─────────────────────────────
function getSavingsLabel(monthlyPriceStr, annualPriceStr) {
  // Try to parse numeric values from price strings like "$11.99"
  const parsePrice = (str) => {
    if (!str) return null;
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : num;
  };

  const monthly = parsePrice(monthlyPriceStr);
  const annual  = parsePrice(annualPriceStr);

  if (monthly && annual) {
    const annualEquivalentMonthly = annual / 12;
    const saving = ((monthly - annualEquivalentMonthly) / monthly) * 100;
    if (saving > 0) {
      return `Save ${Math.round(saving)}%`;
    }
  }

  // Fallback to hardcoded label
  return 'Save 44%';
}

export default PlanSelector;