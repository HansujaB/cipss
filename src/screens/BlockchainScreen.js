import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import {
  getBlockchainNetwork,
  getWalletInfo,
  connectWallet,
  disconnectWallet,
  getBlockchainAchievements,
  getAchievementById,
  mintAchievementNFT,
  verifyAchievement,
  getAchievementVerifications,
  getNFTMetadata,
  transferNFT,
  getReputationScore,
  getBlockchainSettings,
  updateBlockchainSettings,
  getBlockchainStats,
  getTransactionDetails,
  validateAchievementIntegrity,
  generateVerificationReport,
} from '../services/blockchainService';

export default function BlockchainScreen() {
  const [activeTab, setActiveTab] = useState('achievements');
  const [walletInfo, setWalletInfo] = useState(getWalletInfo());
  const [achievements, setAchievements] = useState(getBlockchainAchievements());
  const [network, setNetwork] = useState(getBlockchainNetwork());
  const [settings, setSettings] = useState(getBlockchainSettings());
  const [stats, setStats] = useState(getBlockchainStats());
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementModalVisible, setAchievementModalVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [nftModalVisible, setNftModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [reputationScore, setReputationScore] = useState(getReputationScore('user_1'));

  const tabs = [
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'verifications', label: 'Verifications', icon: '✅' },
    { key: 'nfts', label: 'NFTs', icon: '🎨' },
    { key: 'wallet', label: 'Wallet', icon: '💼' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      setWalletInfo(getWalletInfo());
      setAchievements(getBlockchainAchievements());
      setStats(getBlockchainStats());
      setReputationScore(getReputationScore('user_1'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = () => {
    const result = connectWallet();
    if (result.success) {
      setWalletInfo(getWalletInfo());
      Alert.alert('Success', 'Wallet connected successfully!');
    }
  };

  const handleDisconnectWallet = () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            const result = disconnectWallet();
            if (result.success) {
              setWalletInfo(getWalletInfo());
              Alert.alert('Success', 'Wallet disconnected');
            }
          }
        }
      ]
    );
  };

  const handleVerifyAchievement = (achievementId, comments = '') => {
    const result = verifyAchievement(
      achievementId,
      'user_1',
      'Priya Sharma',
      'peer',
      comments
    );
    
    if (result.success) {
      Alert.alert(
        'Verification Successful',
        `Earned ${result.reward} CIPSS tokens!\nNew reputation score: ${result.newReputationScore}`
      );
      setAchievements(getBlockchainAchievements());
      setWalletInfo(getWalletInfo());
      setReputationScore(getReputationScore('user_1'));
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleViewOnExplorer = (transactionHash) => {
    const url = `${network.explorerUrl}/tx/${transactionHash}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open blockchain explorer');
    });
  };

  const handleValidateIntegrity = (achievementId) => {
    const result = validateAchievementIntegrity(achievementId);
    if (result.success) {
      const message = result.isValid 
        ? 'Achievement integrity is valid and verified on blockchain!'
        : 'Achievement integrity check failed!';
      
      Alert.alert(
        'Integrity Check',
        `${message}\n\nTransaction: ${result.transactionHash}\nBlock: ${result.blockNumber}\nVerifications: ${result.verifications}`
      );
    }
  };

  const handleGenerateReport = (achievementId) => {
    const result = generateVerificationReport(achievementId);
    if (result.success) {
      Alert.alert(
        'Verification Report',
        `Total Verifications: ${result.report.totalVerifications}\nOrganizations: ${result.report.verificationBreakdown.organizations}\nPeers: ${result.report.verificationBreakdown.peers}\nReputation Score: ${result.report.reputationScore}`
      );
    }
  };

  const handleUpdateSetting = (key, value) => {
    const result = updateBlockchainSettings({ [key]: value });
    if (result.success) {
      setSettings(getBlockchainSettings());
    }
  };

  const renderAchievementItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.achievementCard,
        item.verified && styles.verifiedAchievement
      ]}
      onPress={() => {
        setSelectedAchievement(item);
        setAchievementModalVisible(true);
      }}
    >
      <View style={styles.achievementHeader}>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementType}>{item.type}</Text>
        </View>
        <View style={styles.achievementStatus}>
          <Text style={[
            styles.verificationStatus,
            item.verified ? styles.verifiedText : styles.pendingText
          ]}>
            {item.verified ? '✅ Verified' : '⏳ Pending'}
          </Text>
          <Text style={styles.reputationScore}>Rep: {item.reputationScore}</Text>
        </View>
      </View>
      
      <Text style={styles.achievementDescription}>{item.description}</Text>
      
      <View style={styles.achievementMeta}>
        <Text style={styles.metaText}>🔗 {item.transactionHash.substring(0, 10)}...</Text>
        <Text style={styles.metaText}>📊 {item.verifications} verifications</Text>
        <Text style={styles.metaText}>🎨 NFT: {item.nftTokenId.substring(0, 8)}...</Text>
      </View>
      
      <View style={styles.achievementActions}>
        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={() => handleVerifyAchievement(item.id)}
          disabled={item.verifications > 0}
        >
          <Text style={styles.verifyBtnText}>
            {item.verifications > 0 ? 'Verified' : 'Verify'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.explorerBtn}
          onPress={() => handleViewOnExplorer(item.transactionHash)}
        >
          <Text style={styles.explorerBtnText}>View on Explorer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderVerificationItem = ({ item }) => (
    <View style={styles.verificationCard}>
      <View style={styles.verificationHeader}>
        <View style={styles.verifierInfo}>
          <Text style={styles.verifierName}>{item.verifierName}</Text>
          <Text style={styles.verifierType}>{item.verifierType}</Text>
        </View>
        <Text style={styles.verificationTime}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      {item.comments && (
        <Text style={styles.verificationComments}>{item.comments}</Text>
      )}
      
      <View style={styles.verificationFooter}>
        <Text style={styles.verificationHash}>
          Tx: {item.transactionHash.substring(0, 10)}...
        </Text>
        <TouchableOpacity
          onPress={() => handleViewOnExplorer(item.transactionHash)}
        >
          <Text style={styles.viewOnExplorer}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNFTItem = ({ item }) => {
    const metadata = getNFTMetadata(item.nftTokenId);
    
    return (
      <TouchableOpacity
        style={styles.nftCard}
        onPress={() => {
          setSelectedAchievement(item);
          setNftModalVisible(true);
        }}
      >
        <View style={styles.nftHeader}>
          <Text style={styles.nftName}>{metadata?.name || item.title}</Text>
          <View style={styles.nftStatus}>
            <Text style={[
              styles.transferableText,
              item.isTransferable ? styles.transferableAllowed : styles.transferableNotAllowed
            ]}>
              {item.isTransferable ? '🔄 Transferable' : '🔒 Non-transferable'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.nftDescription}>{metadata?.description || item.description}</Text>
        
        {metadata?.attributes && (
          <View style={styles.nftAttributes}>
            {metadata.attributes.slice(0, 3).map((attr, index) => (
              <View key={index} style={styles.attributeItem}>
                <Text style={styles.attributeTrait}>{attr.trait_type}:</Text>
                <Text style={styles.attributeValue}>{attr.value}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.nftFooter}>
          <Text style={styles.nftTokenId}>Token ID: {item.nftTokenId.substring(0, 8)}...</Text>
          <Text style={styles.nftRarity}>
            {metadata?.attributes?.find(a => a.trait_type === 'Rarity')?.value || 'Common'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'achievements':
        return (
          <View style={styles.achievementsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏆 Blockchain Achievements</Text>
              <Text style={styles.sectionSubtitle}>Reputation: {reputationScore}</Text>
            </View>
            
            <FlatList
              data={getBlockchainAchievements('user_1')}
              keyExtractor={(item) => item.id}
              renderItem={renderAchievementItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No blockchain achievements yet</Text>
                  <Text style={styles.emptySubtext}>Complete achievements to mint NFTs</Text>
                </View>
              }
            />
          </View>
        );

      case 'verifications':
        return (
          <View style={styles.verificationsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✅ Verifications</Text>
              <Text style={styles.sectionSubtitle}>{stats.totalVerifications} total</Text>
            </View>
            
            <FlatList
              data={achievements.flatMap(a => getAchievementVerifications(a.id))}
              keyExtractor={(item) => item.id}
              renderItem={renderVerificationItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No verifications yet</Text>
                  <Text style={styles.emptySubtext}>Verify achievements to earn rewards</Text>
                </View>
              }
            />
          </View>
        );

      case 'nfts':
        return (
          <View style={styles.nftsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎨 Achievement NFTs</Text>
              <Text style={styles.sectionSubtitle}>{stats.totalNFTsMinted} minted</Text>
            </View>
            
            <FlatList
              data={getBlockchainAchievements('user_1')}
              keyExtractor={(item) => item.id}
              renderItem={renderNFTItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No NFTs yet</Text>
                  <Text style={styles.emptySubtext}>Mint NFTs by completing achievements</Text>
                </View>
              }
            />
          </View>
        );

      case 'wallet':
        return (
          <ScrollView style={styles.walletContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.walletCard}>
              <Text style={styles.walletTitle}>💼 Blockchain Wallet</Text>
              
              {!walletInfo.connected ? (
                <View style={styles.connectWalletSection}>
                  <Text style={styles.connectWalletText}>Connect your wallet to access blockchain features</Text>
                  <TouchableOpacity
                    style={styles.connectWalletBtn}
                    onPress={handleConnectWallet}
                  >
                    <Text style={styles.connectWalletBtnText}>Connect Wallet</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.walletInfo}>
                  <View style={styles.walletAddressSection}>
                    <Text style={styles.walletAddressLabel}>Wallet Address</Text>
                    <Text style={styles.walletAddress}>{walletInfo.address}</Text>
                  </View>
                  
                  <View style={styles.walletBalanceSection}>
                    <Text style={styles.walletBalanceLabel}>Balance</Text>
                    <Text style={styles.walletBalance}>{walletInfo.balance} CIPSS</Text>
                  </View>
                  
                  <View style={styles.walletNetworkSection}>
                    <Text style={styles.walletNetworkLabel}>Network</Text>
                    <Text style={styles.walletNetwork}>{network.name}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.disconnectWalletBtn}
                    onPress={handleDisconnectWallet}
                  >
                    <Text style={styles.disconnectWalletBtnText}>Disconnect Wallet</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={styles.networkStatsCard}>
              <Text style={styles.networkStatsTitle}>Network Statistics</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.totalAchievements}</Text>
                  <Text style={styles.statLabel}>Achievements</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.totalVerifications}</Text>
                  <Text style={styles.statLabel}>Verifications</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.averageReputationScore}</Text>
                  <Text style={styles.statLabel}>Avg Reputation</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.totalNFTsMinted}</Text>
                  <Text style={styles.statLabel}>NFTs Minted</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'settings':
        return (
          <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>⚙️ Blockchain Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto-verify Achievements</Text>
                  <Text style={styles.settingDescription}>Automatically verify when criteria met</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    settings.autoVerify && styles.toggleBtnOn
                  ]}
                  onPress={() => handleUpdateSetting('autoVerify', !settings.autoVerify)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.autoVerify ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Public by Default</Text>
                  <Text style={styles.settingDescription}>>Make achievements public automatically</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    settings.publicByDefault && styles.toggleBtnOn
                  ]}
                  onPress={() => handleUpdateSetting('publicByDefault', !settings.publicByDefault)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.publicByDefault ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Transferable Achievements</Text>
                  <Text style={styles.settingDescription}>>Allow NFT transfers</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    settings.transferableAchievements && styles.toggleBtnOn
                  ]}
                  onPress={() => handleUpdateSetting('transferableAchievements', !settings.transferableAchievements)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.transferableAchievements ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Gas Optimization</Text>
                  <Text style={styles.settingDescription}>>Optimize transaction costs</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    settings.gasOptimization && styles.toggleBtnOn
                  ]}
                  onPress={() => handleUpdateSetting('gasOptimization', !settings.gasOptimization)}
                >
                  <Text style={styles.toggleBtnText}>
                    {settings.gasOptimization ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Verification Threshold</Text>
                  <Text style={styles.settingDescription}>>{settings.notificationThreshold} verifications</Text>
                </View>
                <View style={styles.thresholdOptions}>
                  {[3, 5, 10].map((threshold) => (
                    <TouchableOpacity
                      key={threshold}
                      style={[
                        styles.thresholdBtn,
                        settings.notificationThreshold === threshold && styles.thresholdBtnActive
                      ]}
                      onPress={() => handleUpdateSetting('notificationThreshold', threshold)}
                    >
                      <Text style={[
                        styles.thresholdBtnText,
                        settings.notificationThreshold === threshold && styles.thresholdBtnTextActive
                      ]}>
                        {threshold}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>⛓️ Blockchain Verification</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {renderContent()}
      
      {/* Achievement Details Modal */}
      <Modal
        visible={achievementModalVisible}
        animationType="slide"
        onRequestClose={() => setAchievementModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAchievementModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Achievement Details</Text>
            <View style={styles.placeholder} />
          </View>
          
          {selectedAchievement && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalAchievementTitle}>{selectedAchievement.title}</Text>
              <Text style={styles.modalAchievementDescription}>{selectedAchievement.description}</Text>
              
              <View style={styles.modalAchievementMeta}>
                <Text style={styles.modalMetaLabel}>Type: {selectedAchievement.type}</Text>
                <Text style={styles.modalMetaLabel}>Reputation: {selectedAchievement.reputationScore}</Text>
                <Text style={styles.modalMetaLabel}>Verifications: {selectedAchievement.verifications}</Text>
                <Text style={styles.modalMetaLabel}>Status: {selectedAchievement.verified ? 'Verified' : 'Pending'}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Blockchain Information</Text>
                <Text style={styles.modalInfoText}>Transaction: {selectedAchievement.transactionHash}</Text>
                <Text style={styles.modalInfoText}>Block: {selectedAchievement.blockNumber}</Text>
                <Text style={styles.modalInfoText}>Timestamp: {new Date(selectedAchievement.timestamp).toLocaleString()}</Text>
                <Text style={styles.modalInfoText}>NFT Token ID: {selectedAchievement.nftTokenId}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Metadata</Text>
                {Object.entries(selectedAchievement.metadata).map(([key, value]) => (
                  <Text key={key} style={styles.modalInfoText}>
                    {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                  </Text>
                ))}
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => handleValidateIntegrity(selectedAchievement.id)}
                >
                  <Text style={styles.modalActionBtnText}>Validate Integrity</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => handleGenerateReport(selectedAchievement.id)}
                >
                  <Text style={styles.modalActionBtnText}>Generate Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => handleViewOnExplorer(selectedAchievement.transactionHash)}
                >
                  <Text style={styles.modalActionBtnText}>View on Explorer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
      
      {/* NFT Details Modal */}
      <Modal
        visible={nftModalVisible}
        animationType="slide"
        onRequestClose={() => setNftModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setNftModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>NFT Details</Text>
            <View style={styles.placeholder} />
          </View>
          
          {selectedAchievement && (() => {
            const metadata = getNFTMetadata(selectedAchievement.nftTokenId);
            return (
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalNFTTitle}>{metadata?.name || selectedAchievement.title}</Text>
                <Text style={styles.modalNFTDescription}>{metadata?.description || selectedAchievement.description}</Text>
                
                <View style={styles.modalNFTImage}>
                  <Text style={styles.modalNFTImagePlaceholder}>🎨 NFT Image</Text>
                </View>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Attributes</Text>
                  {metadata?.attributes?.map((attr, index) => (
                    <View key={index} style={styles.modalAttributeItem}>
                      <Text style={styles.modalAttributeTrait}>{attr.trait_type}:</Text>
                      <Text style={styles.modalAttributeValue}>{attr.value}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>NFT Information</Text>
                  <Text style={styles.modalInfoText}>Token ID: {selectedAchievement.nftTokenId}</Text>
                  <Text style={styles.modalInfoText}>Transferable: {selectedAchievement.isTransferable ? 'Yes' : 'No'}</Text>
                  <Text style={styles.modalInfoText}>Public: {selectedAchievement.isPublic ? 'Yes' : 'No'}</Text>
                  <Text style={styles.modalInfoText}>External URL: {metadata?.external_url}</Text>
                </View>
                
                <TouchableOpacity style={styles.modalPrimaryBtn}>
                  <Text style={styles.modalPrimaryBtnText}>View on OpenSea</Text>
                </TouchableOpacity>
              </ScrollView>
            );
          })()}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A2E',
    padding: 16,
    paddingBottom: 8,
  },

  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },

  tab: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },

  tabActive: {
    backgroundColor: '#1D0A69',
    borderColor: '#1D0A69',
  },

  tabIcon: {
    fontSize: 12,
    marginBottom: 2,
  },

  tabLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  tabLabelActive: {
    color: '#FFFFFF',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  listContainer: {
    padding: 16,
  },

  achievementsContainer: {
    flex: 1,
  },

  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },

  verifiedAchievement: {
    borderLeftColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },

  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  achievementInfo: {
    flex: 1,
  },

  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },

  achievementType: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },

  achievementStatus: {
    alignItems: 'flex-end',
  },

  verificationStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },

  verifiedText: {
    color: '#22C55E',
  },

  pendingText: {
    color: '#F59E0B',
  },

  reputationScore: {
    fontSize: 12,
    color: '#6B7280',
  },

  achievementDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },

  achievementMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },

  metaText: {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  achievementActions: {
    flexDirection: 'row',
    gap: 8,
  },

  verifyBtn: {
    flex: 1,
    backgroundColor: '#1D0A69',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  explorerBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  explorerBtnText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },

  verificationsContainer: {
    flex: 1,
  },

  verificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },

  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  verifierInfo: {
    flex: 1,
  },

  verifierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  verifierType: {
    fontSize: 12,
    color: '#6B7280',
  },

  verificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },

  verificationComments: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontStyle: 'italic',
  },

  verificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  verificationHash: {
    fontSize: 11,
    color: '#6B7280',
  },

  viewOnExplorer: {
    fontSize: 12,
    color: '#1D0A69',
    fontWeight: '600',
  },

  nftsContainer: {
    flex: 1,
  },

  nftCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },

  nftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  nftName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
  },

  nftStatus: {
    alignItems: 'flex-end',
  },

  transferableText: {
    fontSize: 10,
    fontWeight: '600',
  },

  transferableAllowed: {
    color: '#22C55E',
  },

  transferableNotAllowed: {
    color: '#EF4444',
  },

  nftDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },

  nftAttributes: {
    marginBottom: 16,
  },

  attributeItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  attributeTrait: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 8,
  },

  attributeValue: {
    fontSize: 12,
    color: '#1A1A2E',
  },

  nftFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nftTokenId: {
    fontSize: 11,
    color: '#6B7280',
  },

  nftRarity: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  walletContainer: {
    flex: 1,
    padding: 16,
  },

  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },

  walletTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
    textAlign: 'center',
  },

  connectWalletSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  connectWalletText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },

  connectWalletBtn: {
    backgroundColor: '#1D0A69',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  connectWalletBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  walletInfo: {
    gap: 16,
  },

  walletAddressSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },

  walletAddressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  walletAddress: {
    fontSize: 14,
    color: '#1A1A2E',
    fontFamily: 'monospace',
  },

  walletBalanceSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },

  walletBalanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  walletBalance: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D0A69',
  },

  walletNetworkSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },

  walletNetworkLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  walletNetwork: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '500',
  },

  disconnectWalletBtn: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  disconnectWalletBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  networkStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  networkStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D0A69',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  settingsContainer: {
    flex: 1,
    padding: 16,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },

  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 20,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  settingInfo: {
    flex: 1,
  },

  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 2,
  },

  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },

  toggleBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },

  toggleBtnOn: {
    backgroundColor: '#22C55E',
  },

  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  toggleBtnTextOn: {
    color: '#FFFFFF',
  },

  thresholdOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  thresholdBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
  },

  thresholdBtnActive: {
    backgroundColor: '#1D0A69',
  },

  thresholdBtnText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  thresholdBtnTextActive: {
    color: '#FFFFFF',
  },

  modalSafe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  modalCloseBtn: {
    fontSize: 16,
    color: '#1D0A69',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  placeholder: {
    width: 60,
  },

  modalContent: {
    flex: 1,
    padding: 16,
  },

  modalAchievementTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  modalAchievementDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },

  modalAchievementMeta: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },

  modalMetaLabel: {
    fontSize: 14,
    color: '#374151',
  },

  modalSection: {
    marginBottom: 20,
  },

  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  modalInfoText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    fontFamily: 'monospace',
  },

  modalActions: {
    gap: 12,
  },

  modalActionBtn: {
    backgroundColor: '#1D0A69',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  modalNFTTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },

  modalNFTDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },

  modalNFTImage: {
    backgroundColor: '#F3F4F6',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalNFTImagePlaceholder: {
    fontSize: 24,
    color: '#6B7280',
  },

  modalAttributeItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  modalAttributeTrait: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 8,
    width: 100,
  },

  modalAttributeValue: {
    fontSize: 14,
    color: '#1A1A2E',
    flex: 1,
  },

  modalPrimaryBtn: {
    backgroundColor: '#8B5CF6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
