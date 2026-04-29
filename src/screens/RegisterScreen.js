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
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {
    key: 'volunteer',
    label: '🙋 Volunteer',
    description: 'Join campaigns and earn impact points',
    color: '#3B82F6',
  },
  {
    key: 'ngo_admin',
    label: '🏢 NGO Admin',
    description: 'Create and manage campaigns',
    color: '#22C55E',
  },
  {
    key: 'company',
    label: '💼 CSR Company',
    description: 'Fund verified social impact projects',
    color: '#1D0A69',
  },
  {
    key: 'influencer',
    label: '📱 Influencer',
    description: 'Promote campaigns to your audience',
    color: '#F59E0B',
  },
];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateStep1 = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        role: selectedRole,
      });

      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }

      Alert.alert('Registration Successful! 🎉', `Welcome ${name}!`, [
        {
          text: 'Get Started',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Create Account</Text>
      <Text style={styles.stepDesc}>Enter your details to get started</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        placeholder="your@email.com"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password *</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Create a password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.showPasswordBtn}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm Password *</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Password Requirements */}
      <View style={styles.requirementsBox}>
        <Text style={styles.requirementsTitle}>Password must have:</Text>
        <Text style={[styles.requirement, password.length >= 6 && styles.requirementMet]}>
          {password.length >= 6 ? '✓' : '○'} At least 6 characters
        </Text>
        <Text style={[styles.requirement, /[A-Z]/.test(password) && styles.requirementMet]}>
          {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
        </Text>
        <Text style={[styles.requirement, /[0-9]/.test(password) && styles.requirementMet]}>
          {/[0-9]/.test(password) ? '✓' : '○'} One number
        </Text>
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Select Your Role</Text>
      <Text style={styles.stepDesc}>Choose how you want to participate</Text>

      {ROLES.map((role) => (
        <TouchableOpacity
          key={role.key}
          style={[
            styles.roleCard,
            selectedRole === role.key && { borderColor: role.color, backgroundColor: role.color + '10' },
          ]}
          onPress={() => setSelectedRole(role.key)}
        >
          <View style={styles.roleHeader}>
            <Text style={styles.roleLabel}>{role.label}</Text>
            <View
              style={[
                styles.radioBtn,
                selectedRole === role.key && { borderColor: role.color, backgroundColor: role.color },
              ]}
            >
              {selectedRole === role.key && <Text style={styles.radioCheck}>✓</Text>}
            </View>
          </View>
          <Text style={[styles.roleDesc, selectedRole === role.key && { color: role.color }]}>
            {role.description}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Summary */}
      {selectedRole && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>You selected:</Text>
          <Text style={styles.summaryText}>
            {ROLES.find(r => r.key === selectedRole)?.label}
          </Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
          onPress={handleRegister}
          disabled={loading || !selectedRole}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>Create Account</Text>
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back to Login</Text>
            </TouchableOpacity>
            <Text style={styles.logo}>🌍</Text>
          </View>

          {/* Progress */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
          </View>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}

          {/* Terms */}
          <Text style={styles.terms}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 24,
  },

  header: {
    marginBottom: 20,
  },
  backLink: {
    marginBottom: 16,
  },
  backLinkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
  },

  progressBar: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1D0A69',
    borderRadius: 2,
  },

  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A2E',
  },
  showPasswordBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  showPasswordText: {
    fontSize: 18,
  },

  requirementsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  requirementMet: {
    color: '#22C55E',
  },

  nextBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  roleCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  roleDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  radioBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  summaryBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  summaryTitle: {
    fontSize: 13,
    color: '#166534',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
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
  registerBtn: {
    flex: 2,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerBtnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },

  terms: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  termsLink: {
    color: '#1D0A69',
    fontWeight: '600',
  },
});
