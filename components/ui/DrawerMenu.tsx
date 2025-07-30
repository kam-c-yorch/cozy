import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Heart, 
  MessageSquare, 
  Bell, 
  CircleHelp as HelpCircle, 
  Settings, 
  FileText, 
  Shield, 
  Info,
  LogOut,
  ChevronRight,
  User
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { signOut } from '../../lib/auth';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  userProfile?: any;
  onSignOut?: () => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  badge?: number;
}

function MenuItem({ icon, title, subtitle, onPress, showChevron = true, badge }: MenuItemProps) {
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
      <View style={styles.menuItemRight}>
        {badge && badge > 0 && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
        {showChevron && (
          <ChevronRight size={20} color={Colors.secondaryText} strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export function DrawerMenu({ visible, onClose, userProfile, onSignOut }: DrawerMenuProps) {
  const handleSavedProperties = () => {
    onClose();
    console.log('Navigate to Saved Properties');
    // Navigate to saved properties screen
  };

  const handleMessages = () => {
    onClose();
    console.log('Navigate to Messages');
    // Navigate to messages screen
  };

  const handleNotificationSettings = () => {
    onClose();
    console.log('Navigate to Notification Settings');
    // Navigate to notification settings
  };

  const handleSettings = () => {
    onClose();
    console.log('Navigate to Settings');
    // Navigate to settings screen
  };

  const handleHelp = () => {
    onClose();
    console.log('Navigate to Help & Support');
    // Navigate to help screen
  };

  const handleTerms = () => {
    onClose();
    console.log('Navigate to Terms & Conditions');
    // Navigate to terms screen
  };

  const handlePrivacy = () => {
    onClose();
    console.log('Navigate to Privacy Policy');
    // Navigate to privacy screen
  };

  const handleAbout = () => {
    onClose();
    console.log('Navigate to About');
    // Navigate to about screen
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
              onClose();
              onSignOut?.();
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
      title: 'My Account',
      items: [
        {
          icon: <Heart size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Saved Properties',
          subtitle: 'View your favorite listings',
          onPress: handleSavedProperties,
          badge: 12,
        },
        {
          icon: <MessageSquare size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Messages',
          subtitle: 'Chat with realtors and agents',
          onPress: handleMessages,
          badge: 3,
        },
        {
          icon: <Bell size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          onPress: handleNotificationSettings,
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: <Settings size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Settings',
          subtitle: 'App preferences and configuration',
          onPress: handleSettings,
        },
        {
          icon: <HelpCircle size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Help & Support',
          subtitle: 'Get help with using the app',
          onPress: handleHelp,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          icon: <FileText size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Terms & Conditions',
          subtitle: 'Read our terms of service',
          onPress: handleTerms,
        },
        {
          icon: <Shield size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'Privacy Policy',
          subtitle: 'Learn about your privacy',
          onPress: handlePrivacy,
        },
        {
          icon: <Info size={20} color={Colors.primaryText} strokeWidth={2} />,
          title: 'About Cozy Homes',
          subtitle: 'Version 1.0.0',
          onPress: handleAbout,
        },
      ],
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* User Profile Section */}
          {userProfile && (
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <User size={32} color={Colors.white} strokeWidth={2} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {userProfile.profile?.name || 'User'}
                </Text>
                <Text style={styles.userEmail}>
                  {userProfile.profile?.email || 'user@example.com'}
                </Text>
                <View style={styles.userRole}>
                  <Text style={styles.userRoleText}>
                    {userProfile.profile?.role === 'realtor' ? 'Realtor' : 'Home Seeker'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuItems}>
                {section.items.map((item, itemIndex) => (
                  <MenuItem
                    key={itemIndex}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    onPress={item.onPress}
                    badge={item.badge}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Sign Out Section */}
          <View style={styles.signOutSection}>
            <MenuItem
              icon={<LogOut size={20} color={Colors.error} strokeWidth={2} />}
              title="Sign Out"
              onPress={handleSignOut}
              showChevron={false}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
  },
  headerSpacer: {
    width: 40, // Same width as close button for centering
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginBottom: Spacing.sm,
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
  },
  menuItemSubtitle: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  menuBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  menuBadgeText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  
  // Sign Out Section
  signOutSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});