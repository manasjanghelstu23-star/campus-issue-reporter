import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createIssue } from '../services/api';

const ReportIssueScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [problemType, setProblemType] = useState('');
  const [otherProblem, setOtherProblem] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  // 📸 Image picker
  const handleImageResponse = response => {
    if (!response?.didCancel && !response?.errorCode) {
      setPhoto(response.assets[0]);
    }
  };

  const openImagePicker = () => {
    Alert.alert('Capture Issue Photo', 'Choose option', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera(
            { mediaType: 'photo', quality: 0.7 },
            handleImageResponse
          ),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary(
            { mediaType: 'photo', quality: 0.7 },
            handleImageResponse
          ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ✅ Form validation
  const isFormValid =
    problemType &&
    building &&
    floor &&
    room &&
    (problemType !== 'Other' || otherProblem);

  // 📤 Submit
  const submitHandler = async () => {
    setLoading(true);
    try {
      const issueData = {
        problemType: problemType === 'Other' ? otherProblem : problemType,
        building,
        floor,
        room,
        isAnonymous: anonymous,
        // photo attached logic here...
      };
      await createIssue(issueData);

      Alert.alert(
        'Success ✅',
        'Your issue has been reported successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Could not submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Report a Problem</Text>
          <Text style={styles.headerSubtitle}>Submit a new issue</Text>
        </View>
      </View>

      {/* Photo */}
      <View style={styles.card}>
        <MaterialIcons name="photo-camera" size={24} color="black" style={styles.icon} />

        <TouchableOpacity style={styles.uploadBox} onPress={openImagePicker}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.preview} />
          ) : (
            <>
              <Text style={styles.uploadIcon}>⬆️</Text>
              <Text style={styles.uploadText}>
                Tap to capture or upload photo
              </Text>
              <Text style={styles.uploadSubText}>
                Show the issue clearly
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Problem Type */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Problem Type</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={problemType}
            style={{ color: '#a3a3a3' }}
            onValueChange={setProblemType}
          >
            <Picker.Item label="Select problem type" value="" />
            <Picker.Item label="Electrical Issue" value="Electrical" />
            <Picker.Item label="Water Leakage" value="Water" />
            <Picker.Item label="Furniture Damage" value="Furniture" />
            <Picker.Item label="Cleanliness Issue" value="Cleanliness" />
            <Picker.Item label="Internet / WiFi Issue" value="WiFi" />
            <Picker.Item label="Washroom Issue" value="Washroom" />
            <Picker.Item label="AC / Fan Issue" value="AC/Fan" />
            <Picker.Item label="Lighting Issue" value="Lighting" />
            <Picker.Item label="Security Issue" value="Security" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {problemType === 'Other' && (
          <TextInput
            style={[styles.input, { marginTop: 12}]}
            placeholder="Describe your problem"
            placeholderTextColor="#999"
            value={otherProblem}
            onChangeText={setOtherProblem}
          />
        )}
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location Details</Text>

        <Text style={styles.label}>Building / Block</Text>
        <TextInput
          style={styles.input}
          placeholder="Select building"
          placeholderTextColor="#999"
          value={building}
          onChangeText={setBuilding}
        />

        <Text style={styles.label}>Floor</Text>
        <TextInput
          style={styles.input}
          placeholder="Select floor"
          placeholderTextColor="#999"
          value={floor}
          onChangeText={setFloor}
        />

        <Text style={styles.label}>Room / Classroom</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Room 101"
          placeholderTextColor="#999"
          value={room}
          onChangeText={setRoom}
        />
      </View>

      {/* Anonymous */}
      <View style={styles.cardRow}>
        <View>
          <Text style={styles.cardTitle}>Report Anonymously</Text>
          <Text style={styles.subText}>
            Your identity will be hidden
          </Text>
        </View>
        <Switch value={anonymous} onValueChange={setAnonymous} />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: isFormValid && !loading ? '#4F46E5' : '#A5B4FC' },
        ]}
        disabled={!isFormValid || loading}
        onPress={submitHandler}
      >
        <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit Complaint'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default ReportIssueScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FF',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 22,
    
    marginTop: 4,
    backgroundColor: '#fafbfd',
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 8,
  },
  cardRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
    backgroundColor: '#f7f8f9',
  },
  uploadIcon: { fontSize: 30, marginBottom: 8 },
  uploadText: { fontSize: 14, fontWeight: '600', color: '#1E3A8A' },
  uploadSubText: { fontSize: 12, color: '#656f7d', marginTop: 4 },

  preview: { width: '100%', height: 200, borderRadius: 14 },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#cfcfd4',
    borderRadius: 12,
    overflow: 'hidden',
    
  },

  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 6 , color:COLORS.textDark},
  input: {
    borderWidth: 1,
    borderColor: '#a0a1a4',
    borderRadius: 12,
    padding: 14,
    color: COLORS.textDark,
  },

  subText: { fontSize: 12, color: '#6B7280' },

  submitBtn: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 10,
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});