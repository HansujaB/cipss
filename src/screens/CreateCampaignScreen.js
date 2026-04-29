import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createCampaign } from '../services/campaignService';

const DOMAINS = [
  { key: 'waste_management', label: '♻️ Waste Management', color: '#F97316' },
  { key: 'education', label: '📚 Education', color: '#3B82F6' },
  { key: 'environment', label: '🌱 Environment', color: '#22C55E' },
];

export default function CreateCampaignScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [volunteersNeeded, setVolunteersNeeded] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('');

  const toIsoDate = (value) => {
    if (!value) return undefined;
    const parts = value.split('/');
    if (parts.length !== 3) return undefined;
    const [day, month, year] = parts;
    const parsed = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  };

  const validateStep1 = () => {
    if (!title.trim()) return Alert.alert('Error', 'Please enter a campaign title');
    if (!description.trim()) return Alert.alert('Error', 'Please enter a description');
    if (!domain) return Alert.alert('Error', 'Please select a domain');
    setStep(2);
  };

  const validateStep2 = () => {
    if (!location.trim()) return Alert.alert('Error', 'Please enter a location');
    if (!fundingGoal || parseFloat(fundingGoal) <= 0) {
      return Alert.alert('Error', 'Please enter a valid funding goal');
    }
    setStep(3);
  };

  const handleCreate = async () => {
    if (!volunteersNeeded || parseInt(volunteersNeeded) <= 0) {
      return Alert.alert('Error', 'Please enter the number of volunteers needed');
    }

    setLoading(true);

    try {
      await createCampaign({
        title,
        description,
        domain,
        area: location,
        funding_goal: parseFloat(fundingGoal),
        planned_volunteers: parseInt(volunteersNeeded, 10),
        start_date: toIsoDate(startDate),
        end_date: toIsoDate(endDate),
      });

      Alert.alert(
        'Success! 🎉',
        'Your campaign has been created successfully.',
        [
          {
            text: 'View Campaign',
            onPress: () => navigation.navigate('Campaigns'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 1: Campaign Details</Text>
      <Text style={styles.stepDesc}>Tell us about your campaign</Text>

      <Text style={styles.label}>Campaign Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Beach Cleanup Drive 2024"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your campaign goals, activities, and expected outcomes..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Domain *</Text>
      <View style={styles.domainGrid}>
        {DOMAINS.map((d) => (
          <TouchableOpacity
            key={d.key}
            style={[
              styles.domainCard,
              domain === d.key && { borderColor: d.color, backgroundColor: d.color + '10' },
            ]}
            onPress={() => setDomain(d.key)}
          >
            <Text style={[styles.domainCardText, domain === d.key && { color: d.color }]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={validateStep1}>
        <Text style={styles.nextBtnText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 2: Location & Funding</Text>
      <Text style={styles.stepDesc}>Set your campaign parameters</Text>

      <Text style={styles.label}>Location *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Mumbai, Maharashtra"
        placeholderTextColor="#9CA3AF"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Funding Goal (₹) *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 50000"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={fundingGoal}
        onChangeText={setFundingGoal}
      />

      <Text style={styles.label}>Campaign Duration</Text>
      <View style={styles.dateRow}>
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="Start Date (DD/MM/YYYY)"
          placeholderTextColor="#9CA3AF"
          value={startDate}
          onChangeText={setStartDate}
        />
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="End Date (DD/MM/YYYY)"
          placeholderTextColor="#9CA3AF"
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={validateStep2}>
          <Text style={styles.nextBtnText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 3: Impact & Volunteers</Text>
      <Text style={styles.stepDesc}>Finalize your campaign</Text>

      <Text style={styles.label}>Volunteers Needed *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 50"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={volunteersNeeded}
        onChangeText={setVolunteersNeeded}
      />

      <Text style={styles.label}>Expected Impact</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the expected impact of your campaign..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
        value={expectedImpact}
        onChangeText={setExpectedImpact}
      />

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Campaign Summary</Text>
        <Text style={styles.summaryItem}>📋 {title}</Text>
        <Text style={styles.summaryItem}>🏷️ {domain || 'Not selected'}</Text>
        <Text style={styles.summaryItem}>📍 {location}</Text>
        <Text style={styles.summaryItem}>💰 ₹{fundingGoal || '0'} funding goal</Text>
        <Text style={styles.summaryItem}>👥 {volunteersNeeded || '0'} volunteers needed</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.createBtn, loading && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createBtnText}>🚀 Create Campaign</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>← Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Campaign</Text>
            <Text style={styles.subtitle}>Step {step} of 3</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  keyboardView: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },

  header: { marginBottom: 20 },
  back: { marginBottom: 12 },
  backText: { fontSize: 15, color: '#EF4444', fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },

  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 3,
  },

  stepTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  stepDesc: { fontSize: 14, color: '#6B7280', marginBottom: 20 },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },

  domainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  domainCard: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  domainCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  nextBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },

  createBtn: {
    flex: 2,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnDisabled: {
    opacity: 0.7,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },

  summaryBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },
});
