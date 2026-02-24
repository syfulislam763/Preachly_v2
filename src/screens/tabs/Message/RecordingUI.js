// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';


// const lock = require("../../../../assets/img/lock_voice.png")

// const RecordingUI = ({ duration = '0:21', onCancel, onMicPress }) => {
//   return (
//     <View style={styles.container}>
//       {/* Left - Duration with Red Dot */}
//       <View style={styles.durationContainer}>
//         <View style={styles.redDot} />
//         <Text style={styles.durationText}>{duration}s</Text>
//       </View>

//       {/* Center - Cancel */}
//       <TouchableOpacity onPress ={onCancel}>
//         <Text style={styles.cancelText}>Cancel</Text>
//       </TouchableOpacity>

//       <View style={{
//         position:'absolute',
//         right: 12,
//         top: -70,
//       }}>
//         <Image 
//           source={lock}
//           style={{
//             height:50,
//             width:50,
//             objectFit: 'contain',
//           }}
//         />
//       </View>

//       {/* Right - Mic Button */}
//       <TouchableOpacity onPress={onMicPress}>
//         <View style={styles.micOuter}>
//           <View style={styles.micMiddle}>
//             <View style={styles.micInner}>
//               <MaterialCommunityIcons name="microphone" size={24} color="white" />
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     width:"100%",
//     position:'relative'
//   },
//   durationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   redDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'red',
//     marginRight: 6,
//   },
//   durationText: {
//     fontSize: 16,
//     color: '#0B172A',
//   },
//   cancelText: {
//     textDecorationLine: 'underline',
//     color: '#0B6E6E',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   micOuter: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: '#B8E0E0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   micMiddle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#5CBDBD',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   micInner: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#007A7A',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default RecordingUI;




import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, PanResponder, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const lock = require("../../../../assets/img/lock_voice.png");

const RecordingUI = ({ duration = '0:21', onCancel, onMicPress, onMicLock , children}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const locked = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0 ) {
          pan.setValue({ x: 0, y: gesture.dy });
        }

        // Lock event at -70px
        if (gesture.dy <= -70 ) {
          locked.current = true;
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          console.log("locked bro love youe")
        }
      },
      onPanResponderRelease: (_, gesture) => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Left - Duration */}
      <View style={styles.durationContainer}>
        <View style={styles.redDot} />
        <Text style={styles.durationText}>{duration}s</Text>
      </View>

      {/* Center - Cancel */}
      <TouchableOpacity onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      {/* Lock Icon */}
      <View style={styles.lockIcon}>
        <Image source={lock} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
      </View>

      {/* Mic Button */}
      <Animated.View
        style={[styles.micOuter, { transform: [{ translateY: pan.y }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.micMiddle}>
          <View style={styles.micInner}>
            <MaterialCommunityIcons name="microphone" size={24} color="white" />
          </View>
        </View>
      </Animated.View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: "100%",
    position: 'relative'
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginRight: 6,
  },
  durationText: {
    fontSize: 16,
    color: '#0B172A',
  },
  cancelText: {
    textDecorationLine: 'underline',
    color: '#0B6E6E',
    fontSize: 16,
    fontWeight: '500',
  },
  lockIcon: {
    position: 'absolute',
    right: 12,
    top: -70,
  },
  micOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#B8E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micMiddle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5CBDBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007A7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecordingUI;
