import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Phone, MessageSquare, Calendar, User } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { Button } from './Button';
import { Input } from './Input';

interface InquiryModalProps {
  visible: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyPrice: string;
  realtorName: string;
  onSubmit: (inquiry: InquiryData) => void;
}

export interface InquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: 'viewing' | 'info' | 'negotiation';
  preferredDate?: string;
  preferredTime?: string;
}

const inquiryTypes = [
  { id: 'viewing', label: 'Schedule Viewing', icon: <Calendar size={20} color={Colors.accent} strokeWidth={2} /> },
  { id: 'info', label: 'Request Info', icon: <MessageSquare size={20} color={Colors.accent} strokeWidth={2} /> },
  { id: 'negotiation', label: 'Discuss Price', icon: <Phone size={20} color={Colors.accent} strokeWidth={2} /> },
];

export function InquiryModal({ 
  visible, 
  onClose, 
  propertyTitle, 
  propertyPrice, 
  realtorName, 
  onSubmit 
}: InquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InquiryData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'info',
    preferredDate: '',
    preferredTime: '',
  });

  const updateFormData = (field: keyof InquiryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call
      onSubmit(formData);
      Alert.alert('Success', 'Your inquiry has been sent successfully!');
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        inquiryType: 'info',
        preferredDate: '',
        preferredTime: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultMessage = () => {
    switch (formData.inquiryType) {
      case 'viewing':
        return `Hi ${realtorName}, I'm interested in viewing the property "${propertyTitle}" listed at ${propertyPrice}. Could we schedule a viewing?`;
      case 'negotiation':
        return `Hi ${realtorName}, I'm interested in the property "${propertyTitle}" listed at ${propertyPrice}. I'd like to discuss the pricing. Could we talk?`;
      default:
        return `Hi ${realtorName}, I'm interested in learning more about the property "${propertyTitle}" listed at ${propertyPrice}. Could you provide more details?`;
    }
  };

  React.useEffect(() => {
    if (visible && !formData.message) {
      updateFormData('message', getDefaultMessage());
    }
  }, [visible, formData.inquiryType]);

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
          <Text style={styles.headerTitle}>Send Inquiry</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {propertyTitle}
          </Text>
          <Text style={styles.propertyPrice}>{propertyPrice}</Text>
          <Text style={styles.realtorName}>Listed by {realtorName}</Text>
        </View>

        <View style={styles.content}>
          {/* Inquiry Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What would you like to do?</Text>
            <View style={styles.inquiryTypes}>
              {inquiryTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.inquiryType,
                    formData.inquiryType === type.id && styles.inquiryTypeActive
                  ]}
                  onPress={() => updateFormData('inquiryType', type.id as any)}
                >
                  {type.icon}
                  <Text style={[
                    styles.inquiryTypeText,
                    formData.inquiryType === type.id && styles.inquiryTypeTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Contact Information</Text>
            
            <Input
              label="Full Name *"
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address *"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Viewing Schedule (if viewing selected) */}
          {formData.inquiryType === 'viewing' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferred Viewing Time</Text>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Input
                    label="Preferred Date"
                    value={formData.preferredDate}
                    onChangeText={(text) => updateFormData('preferredDate', text)}
                    placeholder="DD/MM/YYYY"
                  />
                </View>
                <View style={styles.rowItem}>
                  <Input
                    label="Preferred Time"
                    value={formData.preferredTime}
                    onChangeText={(text) => updateFormData('preferredTime', text)}
                    placeholder="e.g., 2:00 PM"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Message */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Message *</Text>
            <TextInput
              style={styles.messageInput}
              value={formData.message}
              onChangeText={(text) => updateFormData('message', text)}
              placeholder="Enter your message..."
              multiline
              numberOfLines={4}
              placeholderTextColor={Colors.placeholderText}
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            title="Send Inquiry"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
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
    width: 40,
  },

  // Property Info
  propertyInfo: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  propertyTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.xs,
  },
  propertyPrice: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.accent,
    marginBottom: Spacing.xs,
  },
  realtorName: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
  },

  // Inquiry Types
  inquiryTypes: {
    gap: Spacing.sm,
  },
  inquiryType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    gap: Spacing.sm,
  },
  inquiryTypeActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  inquiryTypeText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  inquiryTypeTextActive: {
    color: Colors.white,
  },

  // Form
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rowItem: {
    flex: 1,
  },
  messageInput: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    textAlignVertical: 'top',
    minHeight: 100,
  },

  // Footer
  footer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    marginTop: 0,
  },
});