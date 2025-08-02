import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, CheckCircle, XCircle, Home } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { Button } from './Button';

interface PropertyStatusManagerProps {
  visible: boolean;
  onClose: () => void;
  propertyId: string;
  currentStatus: 'Active' | 'Pending' | 'Rented' | 'Inactive';
  onStatusChange: (newStatus: string, propertyId: string) => void;
}

const statusOptions = [
  {
    id: 'Active',
    label: 'Active',
    description: 'Property is available for rent',
    icon: <Home size={20} color={Colors.success} strokeWidth={2} />,
    color: Colors.success,
  },
  {
    id: 'Pending',
    label: 'Pending',
    description: 'Application under review',
    icon: <Clock size={20} color={Colors.warning} strokeWidth={2} />,
    color: Colors.warning,
  },
  {
    id: 'Rented',
    label: 'Rented',
    description: 'Property has been rented',
    icon: <CheckCircle size={20} color={Colors.accent} strokeWidth={2} />,
    color: Colors.accent,
  },
  {
    id: 'Inactive',
    label: 'Inactive',
    description: 'Property is not available',
    icon: <XCircle size={20} color={Colors.error} strokeWidth={2} />,
    color: Colors.error,
  },
];

export function PropertyStatusManager({
  visible,
  onClose,
  propertyId,
  currentStatus,
  onStatusChange,
}: PropertyStatusManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    Alert.alert(
      'Update Status',
      `Are you sure you want to change the status to ${selectedStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            setLoading(true);
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              onStatusChange(selectedStatus, propertyId);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to update status. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Update Status</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Status */}
        <View style={styles.currentStatusSection}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={styles.currentStatusCard}>
            {statusOptions.find(s => s.id === currentStatus)?.icon}
            <Text style={styles.currentStatusText}>{currentStatus}</Text>
          </View>
        </View>

        {/* Status Options */}
        <View style={styles.statusOptionsSection}>
          <Text style={styles.sectionTitle}>Select New Status</Text>
          <View style={styles.statusOptions}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status.id}
                style={[
                  styles.statusOption,
                  selectedStatus === status.id && styles.statusOptionSelected,
                ]}
                onPress={() => setSelectedStatus(status.id as any)}
              >
                {status.icon}
                <View style={styles.statusOptionText}>
                  <Text style={[
                    styles.statusOptionLabel,
                    selectedStatus === status.id && styles.statusOptionLabelSelected,
                  ]}>
                    {status.label}
                  </Text>
                  <Text style={[
                    styles.statusOptionDescription,
                    selectedStatus === status.id && styles.statusOptionDescriptionSelected,
                  ]}>
                    {status.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Update Button */}
        <View style={styles.footer}>
          <Button
            title="Update Status"
            onPress={handleStatusUpdate}
            loading={loading}
            disabled={selectedStatus === currentStatus}
            style={styles.updateButton}
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

  // Current Status
  currentStatusSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
  },
  currentStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    gap: Spacing.sm,
  },
  currentStatusText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },

  // Status Options
  statusOptionsSection: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
  },
  statusOptions: {
    gap: Spacing.sm,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  statusOptionSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  statusOptionText: {
    flex: 1,
  },
  statusOptionLabel: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  statusOptionLabelSelected: {
    color: Colors.white,
  },
  statusOptionDescription: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  statusOptionDescriptionSelected: {
    color: Colors.white,
  },

  // Footer
  footer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  updateButton: {
    marginTop: 0,
  },
});