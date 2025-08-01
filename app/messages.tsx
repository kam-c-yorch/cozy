import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MessageSquare, Search, MoreHorizontal } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { Typography, getResponsiveFontSize } from '../constants/Typography';
import { Layout, Spacing } from '../constants/Spacing';
import { ListItemSkeleton } from '../components/ui/LoadingSkeleton';

// Mock conversations data
const mockConversations = [
  {
    id: '1',
    participant: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'realtor',
      online: true,
    },
    lastMessage: {
      text: 'I have availability tomorrow afternoon or this weekend. What works better for you?',
      timestamp: '2 min ago',
      sender: 'other',
      read: false,
    },
    property: {
      title: 'Modern 3BR Apartment',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participant: {
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'home_seeker',
      online: false,
    },
    lastMessage: {
      text: 'Thank you for the viewing! I\'ll discuss with my family and get back to you.',
      timestamp: '1 hour ago',
      sender: 'other',
      read: true,
    },
    property: {
      title: 'Luxury Villa',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participant: {
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'home_seeker',
      online: true,
    },
    lastMessage: {
      text: 'Is the rent negotiable? Also, are pets allowed?',
      timestamp: '3 hours ago',
      sender: 'other',
      read: true,
    },
    property: {
      title: 'Cozy 2BR Flat',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    unreadCount: 0,
  },
  {
    id: '4',
    participant: {
      name: 'David Okafor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'realtor',
      online: false,
    },
    lastMessage: {
      text: 'The property is still available. Would you like to schedule a viewing?',
      timestamp: '1 day ago',
      sender: 'other',
      read: true,
    },
    property: {
      title: 'Executive Duplex',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=50',
    },
    unreadCount: 0,
  },
];

interface ConversationItemProps {
  conversation: typeof mockConversations[0];
  onPress: () => void;
}

function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.conversationLeft}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: conversation.participant.avatar }} style={styles.avatar} />
          {conversation.participant.online && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName}>{conversation.participant.name}</Text>
            <Text style={styles.timestamp}>{conversation.lastMessage.timestamp}</Text>
          </View>
          
          <View style={styles.propertyInfo}>
            <Image source={{ uri: conversation.property.image }} style={styles.propertyImage} />
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {conversation.property.title}
            </Text>
          </View>
          
          <Text 
            style={[
              styles.lastMessage,
              !conversation.lastMessage.read && styles.unreadMessage
            ]} 
            numberOfLines={2}
          >
            {conversation.lastMessage.text}
          </Text>
        </View>
      </View>

      <View style={styles.conversationRight}>
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={16} color={Colors.secondaryText} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState(mockConversations);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleConversationPress = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {totalUnread > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {totalUnread} unread message{totalUnread > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Conversations */}
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
          Array.from({ length: 4 }).map((_, index) => (
            <ListItemSkeleton key={index} showAvatar={true} />
          ))
        ) : conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={Colors.secondaryText} strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>No messages yet</Text>
            <Text style={styles.emptyStateMessage}>
              Start a conversation by inquiring about a property or responding to leads.
            </Text>
          </View>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onPress={() => handleConversationPress(conversation.id)}
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
  searchButton: {
    padding: Spacing.xs,
  },

  // Stats
  statsContainer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statsText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.accent,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Conversations
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  conversationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  participantName: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  timestamp: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },
  propertyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  propertyImage: {
    width: 20,
    height: 20,
    borderRadius: Layout.borderRadius.sm,
    marginRight: Spacing.xs,
  },
  propertyTitle: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    flex: 1,
  },
  lastMessage: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.relaxed,
  },
  unreadMessage: {
    color: Colors.primaryText,
    fontFamily: Typography.fontFamily.semiBold,
  },
  conversationRight: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  unreadBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  unreadCount: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  moreButton: {
    padding: Spacing.xs,
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