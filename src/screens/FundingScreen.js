import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  createPaymentOrder,
  verifyPayment,
  mockVerifyPayment,
  calculateFees,
  openRazorpayCheckout,
} from '../services/paymentService';
import { getScoreColor } from '../utils/impactScore';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];
const PLATFORM_FEE_RATE = 0.05;

export default function FundingScreen({ route, navigation }) {
  const { campaign } = route.params;
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState(null);

  const scoreColor = getScoreColor(campaign.impactScore);

  useEffect(() => {
    const parsed = parseFloat(amount);
    if (parsed > 0) {
      setFees(calculateFees(parsed));
    } else {
      setFees(null);
    }
  }, [amount]);

  const handleFund = async () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);

    try {
      // Create payment order
      const orderData = await createPaymentOrder(
        campaign.id,
        parsed,
        donorName || 'Anonymous',
        donorEmail || null
      );

      // Development mode - use mock verification
      if (orderData.development) {
        Alert.alert(
          'Development Mode',
          'Razorpay not configured. Using mock payment flow.',
          [
            {
              text: 'Proceed',
              onPress: async () => {
                try {
                  const verifyData = await mockVerifyPayment(orderData.transaction.id);
                  if (verifyData.success) {
                    setTxn({
                      id: verifyData.transaction.id,
                      amount: parsed,
                      donorName: donorName || 'Anonymous',
                      timestamp: new Date().toISOString(),
                      receipt: verifyData.transaction.receipt,
                      mock: true,
                    });
                    setSubmitted(true);
                  }
                } catch (error) {
                  Alert.alert('Error', error.message);
                } finally {
                  setLoading(false);
                }
              },
            },
          ]
        );
        return;
      }

      // Production - Open Razorpay checkout
      const paymentResult = await openRazorpayCheckout(
        orderData.order,
        orderData.razorpay_key,
        {
          name: donorName || 'Anonymous',
          email: donorEmail,
          description: `Fund ${campaign.title}`,
        }
      );

      // Verify payment
      const verifyData = await verifyPayment(
        paymentResult.orderId,
        paymentResult.paymentId,
        paymentResult.signature
      );

      if (verifyData.success) {
        setTxn({
          id: verifyData.transaction.id,
          amount: parsed,
          donorName: donorName || 'Anonymous',
          timestamp: new Date().toISOString(),
          receipt: verifyData.transaction.receipt,
        });
        setSubmitted(true);
      }
    } catch (error) {
      Alert.alert('Payment Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && txn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMsg}>{`₹${txn.amount.toLocaleString()} funded to`}</Text>
          <Text style={styles.successCampaign}>{campaign.title}</Text>
          <View style={styles.txnCard}>
            <Text style={styles.txnRow}>Transaction ID: <Text style={styles.txnVal}>{txn.id}</Text></Text>
            <Text style={styles.txnRow}>Donor: <Text style={styles.txnVal}>{txn.donorName}</Text></Text>
            <Text style={styles.txnRow}>Time: <Text style={styles.txnVal}>{new Date(txn.timestamp).toLocaleTimeString()}</Text></Text>
          </View>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: scoreColor }]} onPress={() => navigation.navigate('MainApp', { screen: 'Campaigns' })}>
            <Text style={styles.backBtnText}>Back to Campaigns</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Fund a Campaign</Text>
          <Text style={styles.campaignName}>{campaign.title}</Text>
          <Text style={styles.location}>📍 {campaign.location}</Text>

          {/* Quick Amounts */}
          <Text style={styles.label}>Quick Select Amount (₹)</Text>
          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map((q) => (
              <TouchableOpacity
                key={q}
                style={[
                  styles.quickBtn,
                  parseFloat(amount) === q && { backgroundColor: scoreColor },
                ]}
                onPress={() => setAmount(q.toString())}
              >
                <Text style={[
                  styles.quickText,
                  parseFloat(amount) === q && { color: '#fff' },
                ]}>₹{q.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount */}
          <Text style={styles.label}>Or Enter Custom Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3000"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Donor Name */}
          <Text style={styles.label}>Your Name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Anonymous"
            placeholderTextColor="#9CA3AF"
            value={donorName}
            onChangeText={setDonorName}
          />

          {/* Donor Email */}
          <Text style={styles.label}>Your Email (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            value={donorEmail}
            onChangeText={setDonorEmail}
          />

          {/* Platform Fee Breakdown */}
          {fees && (
            <View style={[styles.feesBox, { borderColor: scoreColor }]}>
              <Text style={styles.feesTitle}>Payment Breakdown</Text>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Donation Amount</Text>
                <Text style={styles.feeValue}>₹{fees.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Platform Fee (5%)</Text>
                <Text style={styles.feeValue}>₹{fees.platformFee.toLocaleString()}</Text>
              </View>
              <View style={[styles.feeRow, styles.netRow]}>
                <Text style={styles.netLabel}>NGO Receives</Text>
                <Text style={[styles.netValue, { color: scoreColor }]}>₹{fees.netAmount.toLocaleString()}</Text>
              </View>
            </View>
          )}

          {/* Summary */}
          {amount ? (
            <View style={[styles.summaryBox, { borderColor: scoreColor }]}>
              <Text style={styles.summaryText}>
                You are funding <Text style={{ fontWeight: '700' }}>₹{parseFloat(amount).toLocaleString()}</Text> to{' '}
                <Text style={{ fontWeight: '700' }}>{campaign.title}</Text>
              </Text>
            </View>
          ) : null}

          {/* Submit */}
          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: scoreColor }]} 
            onPress={handleFund}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>💳 Confirm Funding</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 20, paddingBottom: 50 },
  back: { marginBottom: 16 },
  backText: { fontSize: 15, color: '#3B82F6', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  campaignName: { fontSize: 15, color: '#374151', fontWeight: '600', marginBottom: 2 },
  location: { fontSize: 13, color: '#9CA3AF', marginBottom: 22 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  quickBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A2E',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryBox: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  summaryText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  submitBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  // Success State
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  successIcon: { fontSize: 60, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A2E', marginBottom: 8 },
  successMsg: { fontSize: 16, color: '#6B7280' },
  successCampaign: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 20, textAlign: 'center' },
  txnCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  feesBox: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  feesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  feeLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  feeValue: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  netRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 6,
  },
  netLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  netValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  txnRow: { fontSize: 13, color: '#9CA3AF', marginBottom: 4 },
  txnVal: { color: '#374151', fontWeight: '600' },
  backBtn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center' },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});