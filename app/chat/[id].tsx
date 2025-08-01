import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Phone, Video, MoreHorizontal, Paperclip } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';

// Mock chat data
const mockChats = {
  '1': {
    id: '1',
    participant: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'realtor',
      online: true,
      lastSeen: 'Online now',
    },
    property: {
      title: 'Modern 3BR Apartment',
      price: '₦2,500,000/month',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    messages: [
      {
        id: '1',
        text: 'Hi! I\'m interested in your Modern 3BR Apartment listing.',
        sender: 'user',
        timestamp: '10:30 AM',
        read: true,
      },
      {
        id: '2',
        text: 'Hello! Thank you for your interest. I\'d be happy to help you with any questions about the property.',
        sender: 'other',
        timestamp: '10:32 AM',
        read: true,
      },
      {
        id: '3',
        text: 'Could you tell me more about the neighborhood and nearby amenities?',
        sender: 'user',
        timestamp: '10:35 AM',
        read: true,
      },
      {
        id: '4',
        text: 'Absolutely! The property is located in Victoria Island, which is one of Lagos\' premier business districts. You\'ll have easy access to shopping malls, restaurants, and excellent schools.',
        sender: 'other',
        timestamp: '10:37 AM',
        read: true,
      },
      {
        id: '5',
        text: 'That sounds perfect! When would be a good time to schedule a viewing?',
        sender: 'user',
        timestamp: '10:40 AM',
        read: true,
      },
      {
        id: '6',
        text: 'I have availability tomorrow afternoon or this weekend. What works better for you?',
        sender: 'other',
        timestamp: '10:42 AM',
        read: false,
      },
    ],
  },
};

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <View style={[styles.messageContainer, isOwn ? styles.ownMessage : styles.otherMessage]}>
      <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
          {message.text}
        </Text>
      </View>
      <Text style={[styles.messageTimestamp, isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
        {message.timestamp}
      </Text>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [chat, setChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChat();
  }, [id]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chat?.messages]);

  const loadChat = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        const chatData = mockChats[id as string];
        setChat(chatData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load chat:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chat) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    setNewMessage('');

    // Simulate response after a delay
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! I\'ll get back to you shortly.',
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };

      setChat(prev => ({
        ...prev,
        messages: [...prev.messages, response],
      }));
    }, 2000);
  };

  const handleCall = () => {
    console.log('Initiating call...');
    // Implement call functionality
  };

  const handleVideoCall = () => {
    console.log('Initiating video call...');
    // Implement video call functionality
  };

  const handleAttachment = () => {
    console.log('Opening attachment picker...');
    // Implement file/image attachment
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Chat not found</Text>
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
        
        <View style={styles.headerInfo}>
          <Image source={{ uri: chat.participant.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{chat.participant.name}</Text>
            <Text style={styles.headerStatus}>
              {chat.participant.online ? 'Online now' : chat.participant.lastSeen}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction} onPress={handleCall}>
            <Phone size={20} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction} onPress={handleVideoCall}>
            <Video size={20} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <MoreHorizontal size={20} color={Colors.primaryText} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Info */}
      {chat.property && (
        <View style={styles.propertyInfo}>
          <Image source={{ uri: chat.property.image }} style={styles.propertyImage} />
          <View style={styles.propertyText}>
            <Text style={styles.propertyTitle}>{chat.property.title}</Text>
            <Text style={styles.propertyPrice}>{chat.property.price}</Text>
          </View>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {chat.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender === 'user'}
          />
        ))}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachmentButton} onPress={handleAttachment}>
            <Paperclip size={20} color={Colors.secondaryText} strokeWidth={2} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={Colors.placeholderText}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, newMessage.trim() && styles.sendButtonActive]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={newMessage.trim() ? Colors.white : Colors.secondaryText} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Loading & Error
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  headerStatus: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.success,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerAction: {
    padding: Spacing.xs,
  },

  // Property Info
  propertyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  propertyImage: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.sm,
    marginRight: Spacing.sm,
  },
  propertyText: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  propertyPrice: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.accent,
    marginTop: 2,
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
  },
  messageContainer: {
    marginBottom: Spacing.md,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Layout.borderRadius.lg,
  },
  ownBubble: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: Layout.borderRadius.sm,
  },
  otherBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.relaxed,
  },
  ownMessageText: {
    color: Colors.white,
  },
  otherMessageText: {
    color: Colors.primaryText,
  },
  messageTimestamp: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    marginTop: Spacing.xs,
  },
  ownTimestamp: {
    color: Colors.secondaryText,
    textAlign: 'right',
  },
  otherTimestamp: {
    color: Colors.secondaryText,
    textAlign: 'left',
  },

  // Input
  inputContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  attachmentButton: {
    padding: Spacing.sm,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.background,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.accent,
  },
});