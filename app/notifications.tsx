import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Bell, 
  MessageSquare, 
  Heart, 
  Home, 
  Calendar,
  Settings,
  Check,
  Trash2,
  MoreHorizontal
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { Typography, getResponsiveFontSize } from '../constants/Typography';
import { Layout, Spacing } from '../constants/Spacing';
import { Button } from '../components/ui/Button';
import { ListItemSkeleton } from '../components/ui/LoadingSkeleton';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'inquiry',
    title: 'New Property Inquiry',
    message: 'John Doe is interested in your Modern 3BR Apartment',
    timestamp: '2 minutes ago',
    read: false,
    icon: <MessageSquare size={20} color={Colors.accent} strokeWidth={2} />,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    actionable: true,
  },
  {
    id: '2',
    type: 'favorite',
    title: 'Property Liked',
    message: 'Sarah Johnson liked your Luxury Villa listing',
    timestamp: '1 hour ago',
    read: false,
    icon: <Heart size={20} color={Colors.error} strokeWidth={2} />,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    actionable: false,
  },
  {
    id: '3',
    type: 'viewing',
    title: 'Viewing Scheduled',
    message: 'Michael Chen scheduled a viewing for tomorrow at 2:00 PM',
    timestamp: '3 hours ago',
    read: true,
    icon: <Calendar size={20} color={Colors.success} strokeWidth={2} />,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    actionable: true,
  },
  {
    id: '4',
    type: 'property',
    title: 'New Property Match',
    message: 'A new 2BR apartment in Ikeja matches your search criteria',
    timestamp: '1 day ago',
    read: true,
    icon: <Home size={20} color={Colors.accent} strokeWidth={2} />,
    actionable: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated',
    timestamp: '2 days ago',
    read: true,
    icon: <Settings size={20} color={Colors.secondaryText} strokeWidth={2} />,
    actionable: false,
  },
];

interface NotificationItemProps {
  notification: typeof mockNotifications[0];
  onPress: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
}

function NotificationItem({ notification, onPress, onMarkRead, onDelete }: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <TouchableOpacity 
      style={[styles.notificationItem, !notification.read && styles.notificationItemUnread]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationLeft}>
          {notification.avatar ? (
            <Image source={{ uri: notification.avatar }} style={styles.notificationAvatar} />
          ) : (
            <View style={styles.notificationIconContainer}>
              {notification.icon}
            </View>
          )}
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
          </View>
        </View>
        
        <View style={styles.notificationRight}>
          {!notification.read && <View style={styles.unreadDot} />}
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowActions(!showActions)}
          >
            <MoreHorizontal size={16} color={Colors.secondaryText} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {showActions && (
        <View style={styles.notificationActions}>
          {!notification.read && (
            <TouchableOpacity style={styles.actionButton} onPress={onMarkRead}>
              <Check size={16} color={Colors.success} strokeWidth={2} />
              <Text style={styles.actionButtonText}>Mark as Read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Trash2 size={16} color={Colors.error} strokeWidth={2} />
            <Text style={[styles.actionButtonText, { color: Colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleNotificationPress = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Mark as read when pressed
    if (!notification.read) {
      handleMarkAsRead(notificationId);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'inquiry':
        router.push('/(tabs)/leads');
        break;
      case 'viewing':
        router.push('/(tabs)/leads');
        break;
      case 'property':
        router.push('/(tabs)/search');
        break;
      case 'favorite':
        router.push('/(tabs)/listings');
        break;
      default:
        break;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      {notifications.length > 0 && (
        <View style={styles.actionsBar}>
          {unreadCount > 0 && (
            <Button
              title="Mark All Read"
              onPress={handleMarkAllAsRead}
              variant="outline"
              size="small"
              style={styles.actionBarButton}
            />
          )}
          <Button
            title="Clear All"
            onPress={handleClearAll}
            variant="outline"
            size="small"
            style={styles.actionBarButton}
          />
        </View>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          // Show skeleton loading items
          Array.from({ length: 5 }).map((_, index) => (
            <ListItemSkeleton key={index} showAvatar={true} />
          ))
        ) : filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color={Colors.secondaryText} strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </Text>
            <Text style={styles.emptyStateMessage}>
              {filter === 'unread' 
                ? 'All caught up! Check back later for new updates.'
                : 'You\'ll see notifications about property inquiries, messages, and updates here.'
              }
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => handleNotificationPress(notification.id)}
              onMarkRead={() => handleMarkAsRead(notification.id)}
              onDelete={() => handleDelete(notification.id)}
            />
          ))
        )}
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

  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomColor: Colors.accent,
  },
  filterTabText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },
  filterTabTextActive: {
    color: Colors.accent,
    fontFamily: Typography.fontFamily.semiBold,
  },

  // Actions Bar
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  actionBarButton: {
    marginTop: 0,
    paddingHorizontal: Spacing.md,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Notifications
  notificationItem: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  notificationItemUnread: {
    backgroundColor: '#F8F9FF',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.relaxed,
    marginBottom: Spacing.xs,
  },
  notificationTimestamp: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },
  notificationRight: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  moreButton: {
    padding: Spacing.xs,
  },

  // Actions
  notificationActions: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.sm,
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xxxl,
  },
  emptyStateTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.relaxed,
  },
});