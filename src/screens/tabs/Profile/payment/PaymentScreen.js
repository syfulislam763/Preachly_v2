import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { BASE_URL } from '../../../../context/Paths';
import api from '../../../../context/api';

const CARD_ICONS = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
  mastercard:
    'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg',
  discover:
    'https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg',
  jcb: 'https://upload.wikimedia.org/wikipedia/commons/3/30/JCB_logo.svg',
  diners:
    'https://upload.wikimedia.org/wikipedia/commons/8/88/Diners_Club_Logo3.svg',
  default:
    'https://upload.wikimedia.org/wikipedia/commons/3/36/Credit_card_font_awesome.svg',
};

function detectCardBrand(number) {
  const num = number.replace(/\s/g, '');
  if (/^4/.test(num)) return 'visa';
  if (/^5[1-5]/.test(num)) return 'mastercard';
  if (/^3[47]/.test(num)) return 'amex';
  if (/^6(?:011|5)/.test(num)) return 'discover';
  if (/^35(2[89]|[3-8][0-9])/.test(num)) return 'jcb';
  if (/^3(?:0[0-5]|[68])/.test(num)) return 'diners';
  return 'default';
}

export default function CustomCardPayment() {
  const { confirmSetupIntent } = useStripe();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(''); // format MM/YY
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardBrand, setCardBrand] = useState('default');
  const [planType] = useState('explorer_monthly'); // You can make this dynamic

  useEffect(() => {
    const brand = detectCardBrand(cardNumber);
    setCardBrand(brand);
  }, [cardNumber]);

  function parseExpiry(exp) {
    const [month, year] = exp.split('/');
    return {
      month: parseInt(month, 10),
      year: 2000 + parseInt(year, 10),
    };
  }

  // API call to create setup intent
  async function createSetupIntent() {
    try {
      const response = await api.post('/subscription/payment/setup-intent/');
      
      if (response.data.success) {
        return response.data.data.client_secret;
      } else {
        throw new Error(response.data.message || 'Failed to create setup intent');
      }
    } catch (error) {
      console.error('Setup intent creation error:', error);
      throw error;
    }
  }

  // API call to add payment method
  async function addPaymentMethod(paymentMethodId) {
    try {
      const response = await api.post('/subscription/payment/add-method/', {
        payment_method_id: paymentMethodId,
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add payment method');
      }
      
      return response.data;
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  }

  // API call to create subscription
  async function createSubscription(paymentMethodId) {
    try {
      const response = await api.post('/subscription/create/', {
        plan_type: planType,
        payment_method_id: paymentMethodId,
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create subscription');
      }
      
      return response.data;
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  const handleAddPaymentMethod = async () => {
    if (!cardNumber || !expiry || !cvc) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }

    const { month, year } = parseExpiry(expiry);

    setLoading(true);
    
    try {
      // Step 1: Create setup intent first
      const clientSecret = await createSetupIntent();
      // Step 2: Confirm setup intent with card details directly
      const { setupIntent, error: setupError } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          card: {
            number: cardNumber.replace(/\s+/g, ''),
            expMonth: month,
            expYear: year,
            cvc: cvc,
          },
        },
      });

      if (setupError) {
       
        return;
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        // Step 3: Add payment method to backend
        await addPaymentMethod(setupIntent.payment_method);
        
        Alert.alert('Success', 'Payment method added successfully!');
        
        // Optional: Clear form
        setCardNumber('');
        setExpiry('');
        setCvc('');
      }

    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
      console.error('Payment method setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!cardNumber || !expiry || !cvc) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }

    const { month, year } = parseExpiry(expiry);

    setLoading(true);
    
    try {
      // Step 1: Create setup intent first
      const clientSecret = await createSetupIntent();

      // Step 2: Confirm setup intent with card details directly
      const { setupIntent, error: setupError } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          card: {
            number: cardNumber.replace(/\s+/g, ''),
            expMonth: month,
            expYear: year,
            cvc: cvc,
          },
        },
      });

      if (setupError) {
        Alert.alert('Setup Error', setupError.message);
        return;
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        // Step 3: Add payment method to backend
        await addPaymentMethod(setupIntent.payment_method);
        
        // Step 4: Create subscription
        const subscriptionData = await createSubscription(setupIntent.payment_method);
        
        Alert.alert('Success', 'Subscription created successfully!');
        
        // Optional: Clear form
        setCardNumber('');
        setExpiry('');
        setCvc('');
        
        // You might want to navigate to a success screen here
      
      }

    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
      console.error('Subscription creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>
      
      <Text style={styles.label}>Card Number</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="4242 4242 4242 4242"
          keyboardType="number-pad"
          value={cardNumber}
          onChangeText={text => {
            const formatted = text
              .replace(/\D/g, '')
              .replace(/(.{4})/g, '$1 ')
              .trim();
            setCardNumber(formatted);
          }}
          maxLength={19}
        />
        <Image
          source={{ uri: CARD_ICONS[cardBrand] }}
          style={styles.cardIcon}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.label}>Expiry (MM/YY)</Text>
      <TextInput
        style={[styles.input, styles.inputContainer]}
        placeholder="12/25"
        keyboardType="number-pad"
        value={expiry}
        onChangeText={text => {
          let formatted = text.replace(/\D/g, '');
          if (formatted.length > 2) {
            formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
          }
          setExpiry(formatted);
        }}
        maxLength={5}
      />

      <Text style={styles.label}>CVC</Text>
      <TextInput
        style={[styles.input, styles.inputContainer]}
        placeholder="123"
        keyboardType="number-pad"
        value={cvc}
        onChangeText={setCvc}
        maxLength={4}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handleAddPaymentMethod}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.payButtonText}>
          {loading ? 'Processing...' : 'Add Payment Method'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.subscribeButton, loading && styles.payButtonDisabled]}
        onPress={handleSubscribe}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.payButtonText}>
          {loading ? 'Processing...' : `Subscribe to ${planType}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  input: {
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  cardIcon: {
    width: 50,
    height: 30,
    marginLeft: 10,
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  subscribeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#a0cfff',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});