import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { apiFetch } from '../services/api';
import NavigationHeader from '../components/NavigationHeader';

const DOMAINS = [
  { key: 'waste_management', label: '♻️ Waste Management', color: '#F97316' },
  { key: 'environment', label: '🌱 Environment', color: '#22C55E' },
  { key: 'education', label: '📚 Education', color: '#3B82F6' },
];

const SAMPLE_JSON = JSON.stringify(
  [
    {
      area: 'Dharavi, Mumbai',
      lat: 19.0422,
      lng: 72.8553,
      wasteKg: 450,
      domain: 'waste_management',
      date: new Date().toISOString().split('T')[0],
    },
    {
      area: 'Kurla, Mumbai',
      lat: 19.0726,
      lng: 72.8795,
      wasteKg: 280,
      domain: 'waste_management',
      date: new Date().toISOString().split('T')[0],
    },
  ],
  null,
  2
);

export default function NGOUploadScreen({ navigation }) {
  const [selectedDomain, setSelectedDomain] = useState('waste_management');
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleUpload = async () => {
    if (!jsonInput.trim()) {
      Alert.alert('Error', 'Please enter JSON data to upload');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      Alert.alert('Invalid JSON', 'Please enter valid JSON data. Check the format below.');
      return;
    }

    if (!Array.isArray(parsed)) {
      Alert.alert('Invalid Format', 'JSON must be an array of metric objects.');
      return;
    }

    setLoading(true);
    setUploadResult(null);

    try {
      const result = await apiFetch('/ngo/upload', {
        method: 'POST',
        body: JSON.stringify({ metrics: parsed, domain: selectedDomain }),
      });

      setUploadResult({
        success: true,
        count: result.count || parsed.length,
        message: result.message || `${parsed.length} metrics uploaded successfully`,
      });

      Alert.alert(
        '✅ Upload Successful',
        `${result.count || parsed.length} metrics uploaded. Hotspot data will update shortly.`,
        [
          { text: 'View Hotspots', onPress: () => navigation.navigate('HotspotMap') },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      setUploadResult({ success: false, message: error.message });
      Alert.alert('Upload Failed', error.message || 'Failed to upload metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    const sample = JSON.parse(SAMPLE_JSON);
    sample.forEach(item => { item.domain = selectedDomain; });
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  const domainColor = DOMAINS.find(d => d.key === selectedDomain)?.color || '#1D0A69';

  return (
    <View style={styles.container}>
      <NavigationHeader
        title="Upload NGO Metrics"
        showBackButton
        onBackPress={() => navigation.goBack()}
        onNotificationPress={() => Alert.alert('Notifications', 'No new notifications')}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <SafeAreaView style={styles.body}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Info banner */}
            <View style={styles.infoBanner}>
              <Text style={styles.infoIcon}>📊</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Upload Field Metrics</Text>
                <Text style={styles.infoDesc}>
                  Upload NGO field data to generate hotspot maps and AI-powered insights for your domain.
                </Text>
              </View>
            </View>

            {/* Domain selector */}
            <Text style={styles.label}>Select Domain *</Text>
            <View style={styles.domainGrid}>
              {DOMAINS.map((d) => (
                <TouchableOpacity
                  key={d.key}
                  style={[
                    styles.domainCard,
                    selectedDomain === d.key && { borderColor: d.color, backgroundColor: d.color + '12' },
                  ]}
                  onPress={() => setSelectedDomain(d.key)}
                >
                  <Text style={[styles.domainCardText, selectedDomain === d.key && { color: d.color }]}>
                    {d.label}
                  </Text>
                  {selectedDomain === d.key && (
                    <View style={[styles.domainCheck, { backgroundColor: d.color }]}>
                      <Text style={styles.domainCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* JSON input */}
            <View style={styles.inputHeader}>
              <Text style={styles.label}>Metrics JSON *</Text>
              <TouchableOpacity style={styles.sampleBtn} onPress={loadSample}>
                <Text style={styles.sampleBtnText}>Load Sample</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.jsonInput}
              placeholder={`Paste your JSON array here...\n\nExample:\n[\n  {\n    "area": "Dharavi",\n    "lat": 19.04,\n    "lng": 72.85,\n    "wasteKg": 450,\n    "date": "2026-04-30"\n  }\n]`}
              placeholderTextColor="#9CA3AF"
              multiline
              value={jsonInput}
              onChangeText={setJsonInput}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Required fields guide */}
            <View style={styles.schemaCard}>
              <Text style={styles.schemaTitle}>Required Fields per Record</Text>
              {[
                { field: 'area', type: 'string', desc: 'Location name (e.g. "Dharavi, Mumbai")' },
                { field: 'lat', type: 'number', desc: 'Latitude (e.g. 19.0422)' },
                { field: 'lng', type: 'number', desc: 'Longitude (e.g. 72.8553)' },
                { field: 'wasteKg', type: 'number', desc: 'Waste collected in kg' },
                { field: 'date', type: 'string', desc: 'ISO date (e.g. "2026-04-30")' },
              ].map((f) => (
                <View key={f.field} style={styles.schemaRow}>
                  <Text style={styles.schemaField}>{f.field}</Text>
                  <Text style={styles.schemaType}>{f.type}</Text>
                  <Text style={styles.schemaDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>

            {/* Upload result */}
            {uploadResult && (
              <View style={[
                styles.resultCard,
                uploadResult.success ? styles.resultSuccess : styles.resultError,
              ]}>
                <Text style={styles.resultIcon}>{uploadResult.success ? '✅' : '❌'}</Text>
                <Text style={styles.resultText}>{uploadResult.message}</Text>
              </View>
            )}

            {/* Upload button */}
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: domainColor }, loading && styles.uploadBtnDisabled]}
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.uploadBtnText}>📤 Upload Metrics</Text>
              )}
            </TouchableOpacity>

            {/* Quick nav */}
            <View style={styles.quickNav}>
              <TouchableOpacity
                style={styles.quickNavBtn}
                onPress={() => navigation.navigate('HotspotMap')}
              >
                <Text style={styles.quickNavText}>🗺️ View Hotspot Map</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickNavBtn}
                onPress={() => navigation.navigate('Insights')}
              >
                <Text style={styles.quickNavText}>📈 View Insights</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  body: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoIcon: { fontSize: 28, marginRight: 12 },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#1E40AF', marginBottom: 4 },
  infoDesc: { fontSize: 13, color: '#3B82F6', lineHeight: 18 },

  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10 },

  domainGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  domainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  domainCardText: { fontSize: 13, fontWeight: '600', color: '#6B7280', flex: 1 },
  domainCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  domainCheckText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sampleBtn: {
    backgroundColor: '#1D0A69',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sampleBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  jsonInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 12,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 200,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 16,
  },

  schemaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  schemaTitle: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 },
  schemaRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  schemaField: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D0A69',
    width: 70,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  schemaType: {
    fontSize: 11,
    color: '#F97316',
    width: 50,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  schemaDesc: { fontSize: 11, color: '#6B7280', flex: 1 },

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  resultSuccess: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  resultError: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  resultIcon: { fontSize: 20, marginRight: 10 },
  resultText: { fontSize: 14, color: '#374151', flex: 1 },

  uploadBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadBtnDisabled: { opacity: 0.7 },
  uploadBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  quickNav: { flexDirection: 'row', gap: 10 },
  quickNavBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickNavText: { fontSize: 13, fontWeight: '600', color: '#374151' },
});
