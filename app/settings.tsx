import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Mail, 
  Shield, 
  Trash2, 
  Download,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { Typography, getResponsiveFontSize } from '../constants/Typography';
import { Layout, Spacing } from '../constants/Spacing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { getCurrentUserProfile, signOut } from '../lib/auth';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

function SettingsItem({ icon, title, subtitle, onPress, showChevron = true, rightElement }: SettingsItemProps) {
  return (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsItemIcon}>
          {icon}
        </View>
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightElement}
        {showChevron && onPress && (
          <ChevronRight size={20} color={Colors.secondaryText} strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification preferences
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be prepared and sent to your email address. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Type "DELETE" to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', style: 'destructive', onPress: () => console.log('Account deleted') },
              ]
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Lock size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Change Password"
              subtitle="Update your account password"
              onPress={() => setShowPasswordSection(!showPasswordSection)}
              rightElement={
                showPasswordSection ? 
                  <EyeOff size={20} color={Colors.secondaryText} strokeWidth={2} /> :
                  <Eye size={20} color={Colors.secondaryText} strokeWidth={2} />
              }
            />
          </View>

          {/* Password Change Section */}
          {showPasswordSection && (
            <View style={styles.passwordSection}>
              <Input
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
              />
              <Input
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />
              <Input
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
              />
              <Button
                title="Change Password"
                onPress={handleChangePassword}
                loading={passwordLoading}
                style={styles.changePasswordButton}
              />
            </View>
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Bell size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Push Notifications"
              subtitle="Receive notifications on your device"
              showChevron={false}
              rightElement={
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
              }
            />
            <SettingsItem
              icon={<Mail size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Email Notifications"
              subtitle="Receive updates via email"
              showChevron={false}
              rightElement={
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
              }
            />
            <SettingsItem
              icon={<Mail size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Marketing Emails"
              subtitle="Receive promotional content"
              showChevron={false}
              rightElement={
                <Switch
                  value={marketingEmails}
                  onValueChange={setMarketingEmails}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
              }
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Shield size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Profile Visibility"
              subtitle="Make your profile visible to others"
              showChevron={false}
              rightElement={
                <Switch
                  value={profileVisibility}
                  onValueChange={setProfileVisibility}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
              }
            />
            <SettingsItem
              icon={<Eye size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Show Online Status"
              subtitle="Let others see when you're online"
              showChevron={false}
              rightElement={
                <Switch
                  value={showOnlineStatus}
                  onValueChange={setShowOnlineStatus}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
              }
            />
            <SettingsItem
              icon={<Mail size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Allow Messages"
              subtitle="Receive messages from other users"
              showChevron={false}
              rightElement={
                <Switch
                  value={allowMessages}
                  onValueChange={setAllowMessages}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
              }
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Download size={20} color={Colors.primaryText} strokeWidth={2} />}
              title="Export Data"
              subtitle="Download a copy of your data"
              onPress={handleExportData}
            />
            <SettingsItem
              icon={<Trash2 size={20} color={Colors.error} strokeWidth={2} />}
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
  },
  headerSpacer: {
    width: 40,
  },

  // Content
  scrollView: {
    flex: 1,
  },

  // Sections
  section: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.secondaryText,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.white,
  },

  // Settings Items
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  settingsItemSubtitle: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  // Password Section
  passwordSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.lg,
  },
  changePasswordButton: {
    marginTop: Spacing.md,
  },
});