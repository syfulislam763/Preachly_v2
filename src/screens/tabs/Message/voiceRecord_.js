
import { Audio } from "expo-av";
const formatDuration = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
};


export const requestPermission = async () => {
      try {
        const perm = await Audio.requestPermissionsAsync();
        if (perm.status === "granted") {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground:false,
          });
        }
      } catch (err) {
        console.log("Permission error:", err);
      }
    }
export async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status == 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground:false,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        return {recording, success:true}
      }
    } catch (err) {
        return {err, success:false}
    }
}

export async function stopRecording(recording, setRecording) {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI()
    const { sound: playbackSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false } // Don't auto-play
    );

    // Get duration (in milliseconds)
    const status = await playbackSound.getStatusAsync();
    const temp = uri.split("/")
    const newRecording = {
      sound: playbackSound,
      duration: formatDuration(status.durationMillis), // Implement this function
      file: uri,
      name: `recording_${Date.now()}.${temp[temp.length-1].split(".")[1]}`,
    };
    
    return newRecording
     
  }

