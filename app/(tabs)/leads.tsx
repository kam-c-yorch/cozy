import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Menu, MessageSquare, Phone, Mail, Clock, User } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';

// Mock leads data
const mockLeads = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+234 801 234 5678',
    property: 'Modern 3BR Apartment',
    message: 'I am interested in viewing this property. When would be a good time?',
    timestamp: '2 hours ago',
    status: 'new',
    priority: 'high',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+234 802 345 6789',
    property: 'Luxury Villa',
    message: 'Can you provide more details about the amenities and neighborhood?',
    timestamp: '5 hours ago',
    status: 'responded',
    priority: 'medium',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+234 803 456 7890',
    property: 'Executive Duplex',
    message: 'I would like to schedule a viewing for this weekend.',
    timestamp: '1 day ago',
    status: 'scheduled',
    priority: 'high',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+234 804 567 8901',
    property: 'Cozy 2BR Flat',
    message: 'Is the rent negotiable? Also, are pets allowed?',
    timestamp: '2 days ago',
    status: 'responded',
    priority: 'low',
  },
];

interface LeadCardProps {
  lead: typeof mockLeads[0];
  onPress: () => void;
  onCall: () => void;
  onEmail: () => void;
}

function LeadCard({ lead, onPress, onCall, onEmail }: LeadCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return Colors.success;
      case 'responded': return Colors.accent;
      case 'scheduled': return Colors.warning;
      default: return Colors.secondaryText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return Colors.error;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.secondaryText;
    }
  };

  return (
    <TouchableOpacity style={styles.leadCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leadHeader}>
        <View style={styles.leadInfo}>
          <View style={styles.nameRow}>
            <User size={16} color={Colors.primaryText} strokeWidth={2} />
            <Text style={styles.leadName}>{lead.name}</Text>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(lead.priority) }]} />
          </View>
          <Text style={styles.propertyName}>{lead.property}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) }]}>
            <Text style={styles.statusText}>{lead.status}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.leadMessage} numberOfLines={2}>
        {lead.message}
      </Text>

      <View style={styles.leadFooter}>
        <View style={styles.timestampContainer}>
          <Clock size={12} color={Colors.secondaryText} strokeWidth={2} />
          <Text style={styles.timestamp}>{lead.timestamp}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={onEmail}>
            <Mail size={16} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onCall}>
            <Phone size={16} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <MessageSquare size={16} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function LeadsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleLeadPress = (leadId: string) => {
    console.log('Lead pressed:', leadId);
    // Navigate to lead details/chat
  };

  const handleCall = (leadId: string) => {
    console.log('Call lead:', leadId);
    // Initiate phone call
  };

  const handleEmail = (leadId: string) => {
    console.log('Email lead:', leadId);
    // Open email composer
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
    // Navigate to notifications screen
  };

  const handleMenu = () => {
    console.log('Menu pressed');
    // Open drawer or menu
  };

  const newLeadsCount = mockLeads.filter(lead => lead.status === 'new').length;
  const totalLeads = mockLeads.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
          <Menu size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Leads</Text>
        </View>
        
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
          <Bell size={24} color={Colors.primaryText} strokeWidth={2} />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{newLeadsCount}</Text>
          <Text style={styles.statLabel}>New Leads</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalLeads}</Text>
          <Text style={styles.statLabel}>Total Leads</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {mockLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onPress={() => handleLeadPress(lead.id)}
            onCall={() => handleCall(lead.id)}
            onEmail={() => handleEmail(lead.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
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
  menuButton: {
    padding: Spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('title') * Typography.lineHeight.normal,
  },
  notificationButton: {
    padding: Spacing.xs,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.accent,
    lineHeight: getResponsiveFontSize('title') * Typography.lineHeight.normal,
  },
  statLabel: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 2,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  
  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  
  // Lead Cards
  leadCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  leadInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  leadName: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginLeft: Spacing.xs,
    flex: 1,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.xs,
  },
  propertyName: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  leadMessage: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.relaxed,
    marginBottom: Spacing.sm,
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.background,
  },
});