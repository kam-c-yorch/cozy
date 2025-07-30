import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Heart, MessageSquare, CircleHelp as HelpCircle, LogOut, ChevronRight, Bell, Shield, CreditCard } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { signOut, getCurrentUserProfile } from '../../lib/auth';
import { router } from 'expo-router';

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}

function ProfileMenuItem({ icon, title, subtitle, onPress, showChevron = true }: ProfileMenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          {icon}
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && (
        <ChevronRight size={20} color={Colors.secondaryText} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );
}

interface ProfileScreenProps {
  onSignOut: () => void;
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          onPress: () => console.log('Edit Profile'),
        },
        {
          icon: <Bell size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          onPress: () => console.log('Notifications'),
        },
        {
          icon: <Shield size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Privacy & Security',
          subtitle: 'Control your privacy settings',
          onPress: () => console.log('Privacy'),
        },
      ],
    },
    {
      title: 'Activity',
      items: [
        {
          icon: <Heart size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Saved Properties',
          subtitle: 'View your favorite listings',
          onPress: () => console.log('Saved Properties'),
        },
        {
          icon: <MessageSquare size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Messages',
          subtitle: 'Chat with realtors and property owners',
          onPress: () => console.log('Messages'),
        },
        {
          icon: <CreditCard size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Payment History',
          subtitle: 'View your transaction history',
          onPress: () => console.log('Payment History'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Help & Support',
          subtitle: 'Get help with using the app',
          onPress: () => console.log('Help'),
        },
        {
          icon: <Settings size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Settings',
          subtitle: 'App preferences and configuration',
          onPress: () => console.log('Settings'),
        },
      ],
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <User size={40} color={Colors.white} strokeWidth={2} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {userProfile?.profile?.name || 'User'}
            </Text>
            <Text style={styles.userEmail}>
              {userProfile?.profile?.email || 'user@example.com'}
            </Text>
            <View style={styles.userRole}>
              <Text style={styles.userRoleText}>
                {userProfile?.profile?.role === 'realtor' ? 'Realtor' : 'Home Seeker'}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <ProfileMenuItem
                  key={itemIndex}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  onPress={item.onPress}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <ProfileMenuItem
            icon={<LogOut size={20} color={Colors.error} strokeWidth={2} />}
            title="Sign Out"
            onPress={handleSignOut}
            showChevron={false}
          />
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
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('title') * Typography.lineHeight.normal,
  },
  
  // Content
  scrollView: {
    flex: 1,
  },
  
  // User Section
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.xs,
    lineHeight: getResponsiveFontSize('title') * Typography.lineHeight.normal,
  },
  userEmail: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginBottom: Spacing.sm,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  userRole: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  userRoleText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },
  
  // Menu Sections
  menuSection: {
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
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  menuItems: {
    backgroundColor: Colors.white,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  menuItemSubtitle: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 2,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  
  // Sign Out Section
  signOutSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});