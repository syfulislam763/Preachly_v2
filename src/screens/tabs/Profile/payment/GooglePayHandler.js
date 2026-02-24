import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useStripe, usePlatformPay, PlatformPayButton } from '@stripe/stripe-react-native';

export default function GooglePayTest() {
  const { isPlatformPaySupported } = usePlatformPay();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await isPlatformPaySupported({ googlePay: { testEnv: true } });
      console.log("Google Pay Supported:", result);
      setSupported(result);
      if (!result) Alert.alert("Google Pay not supported on this device");
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Google Pay Supported: {supported ? 'Yes' : 'No'}</Text>
      {supported && (
        <PlatformPayButton
          onPress={() => console.log("Google Pay Pressed")}
          type="pay"
          style={{ width: 200, height: 50 }}
        />
      )}
    </View>
  );
}
