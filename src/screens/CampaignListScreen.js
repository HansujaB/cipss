import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import CampaignCard from '../components/CampaignCard';
import { getCampaigns, joinCampaign } from '../services/campaignService';

const DOMAINS = ['All', 'waste', 'environment', 'education', 'health'];

export default function CampaignListScreen({ navigation }) {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const data = getCampaigns();
    setCampaigns(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = campaigns;

    if (activeFilter !== 'All') {
      result = result.filter((c) => c.domain === activeFilter);
    }

    if (search.trim()) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, activeFilter, campaigns]);

  // 🔥 NEW: Join handler
  const handleJoin = (campaignId) => {
    joinCampaign(campaignId);
    alert('Joined campaign successfully!');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CSR Campaigns</Text>
          <Text style={styles.headerSub}>{filtered.length} active campaigns</Text>
        </View>

        {/* Search */}
        <TextInput
          style={styles.search}
          placeholder="Search campaigns or locations..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />

        {/* Filters */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DOMAINS}
          keyExtractor={(item) => item}
          style={styles.filterRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, activeFilter === item && styles.filterBtnActive]}
              onPress={() => setActiveFilter(item)}
            >
              <Text
                style={[styles.filterText, activeFilter === item && styles.filterTextActive]}
              >
                {item === 'All' ? '🌐 All' : item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Campaign List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View>
              <CampaignCard
                campaign={item}
                onPress={(c) =>
                  navigation.navigate('CampaignDetail', { campaign: c })
                }
                onJoin={handleJoin}
              />

              {/* 🔥 NEW: Join Button */}
              <TouchableOpacity
                style={styles.joinBtn}
                onPress={() => handleJoin(item.id)}
              >
                <Text style={styles.joinText}>Join Campaign</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No campaigns found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, paddingHorizontal: 16 },

  header: { paddingTop: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A2E' },
  headerSub: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },

  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 12,
    elevation: 2,
  },

  filterRow: { marginBottom: 14, flexGrow: 0 },

  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },

  filterBtnActive: { backgroundColor: '#1A1A2E' },

  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '700' },

  list: { paddingBottom: 30 },

  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },

  // 🔥 NEW STYLE
  joinBtn: {
    backgroundColor: '#1D0A69',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  joinText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});