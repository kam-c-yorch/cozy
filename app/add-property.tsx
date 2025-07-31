import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Plus, 
  X,
  Check,
  Home,
  Bed,
  Bath,
  Square
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { Typography, getResponsiveFontSize } from '../constants/Typography';
import { Layout, Spacing } from '../constants/Spacing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const propertyTypes = ['Apartment', 'House', 'Villa', 'Duplex', 'Penthouse', 'Studio', 'Office', 'Shop'];

const amenities = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Generator', 
  'Air Conditioning', 'Balcony', 'Garden', 'Elevator', 'Furnished',
  'WiFi', 'CCTV', 'Backup Water', 'Playground', 'Laundry'
];

const nigerianStates = [
  'Lagos', 'Abuja', 'Rivers', 'Kano', 'Oyo', 'Delta', 'Edo', 'Kaduna',
  'Ogun', 'Cross River', 'Akwa Ibom', 'Anambra', 'Imo', 'Enugu'
];

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  address: string;
  city: string;
  state: string;
  amenities: string[];
  images: string[];
  furnished: boolean;
  petFriendly: boolean;
  status: 'Active' | 'Inactive';
}

export default function AddPropertyScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    state: '',
    amenities: [],
    images: [],
    furnished: false,
    petFriendly: false,
    status: 'Active',
  });

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = formData.amenities;
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    updateFormData('amenities', updatedAmenities);
  };

  const addImage = () => {
    // Mock image addition - in real app would use image picker
    const mockImages = [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    updateFormData('images', [...formData.images, randomImage]);
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', updatedImages);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Property added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive,
            currentStep > step && styles.stepCircleCompleted
          ]}>
            {currentStep > step ? (
              <Check size={16} color={Colors.white} strokeWidth={2} />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 4 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <Input
        label="Property Title"
        value={formData.title}
        onChangeText={(text) => updateFormData('title', text)}
        placeholder="e.g., Modern 3BR Apartment in Victoria Island"
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Property Type</Text>
        <View style={styles.optionsGrid}>
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                formData.propertyType === type && styles.optionButtonActive
              ]}
              onPress={() => updateFormData('propertyType', type)}
            >
              <Text style={[
                styles.optionButtonText,
                formData.propertyType === type && styles.optionButtonTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Monthly Rent (₦)"
        value={formData.price}
        onChangeText={(text) => updateFormData('price', text)}
        placeholder="e.g., 2500000"
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Input
            label="Bedrooms"
            value={formData.bedrooms}
            onChangeText={(text) => updateFormData('bedrooms', text)}
            placeholder="3"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.rowItem}>
          <Input
            label="Bathrooms"
            value={formData.bathrooms}
            onChangeText={(text) => updateFormData('bathrooms', text)}
            placeholder="2"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.rowItem}>
          <Input
            label="Area (sqm)"
            value={formData.area}
            onChangeText={(text) => updateFormData('area', text)}
            placeholder="120"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Location Details</Text>
      
      <Input
        label="Full Address"
        value={formData.address}
        onChangeText={(text) => updateFormData('address', text)}
        placeholder="e.g., 15 Ahmadu Bello Way"
      />

      <Input
        label="City/Area"
        value={formData.city}
        onChangeText={(text) => updateFormData('city', text)}
        placeholder="e.g., Victoria Island"
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>State</Text>
        <View style={styles.optionsGrid}>
          {nigerianStates.map((state) => (
            <TouchableOpacity
              key={state}
              style={[
                styles.optionButton,
                formData.state === state && styles.optionButtonActive
              ]}
              onPress={() => updateFormData('state', state)}
            >
              <Text style={[
                styles.optionButtonText,
                formData.state === state && styles.optionButtonTextActive
              ]}>
                {state}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Property Features</Text>
      
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          placeholder="Describe your property in detail..."
          multiline
          numberOfLines={4}
          placeholderTextColor={Colors.placeholderText}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Amenities</Text>
        <View style={styles.amenitiesGrid}>
          {amenities.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.amenityButton,
                formData.amenities.includes(amenity) && styles.amenityButtonActive
              ]}
              onPress={() => toggleAmenity(amenity)}
            >
              <Text style={[
                styles.amenityButtonText,
                formData.amenities.includes(amenity) && styles.amenityButtonTextActive
              ]}>
                {amenity}
              </Text>
              {formData.amenities.includes(amenity) && (
                <Check size={16} color={Colors.white} strokeWidth={2} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            formData.furnished && styles.toggleButtonActive
          ]}
          onPress={() => updateFormData('furnished', !formData.furnished)}
        >
          <Text style={[
            styles.toggleButtonText,
            formData.furnished && styles.toggleButtonTextActive
          ]}>
            Furnished
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            formData.petFriendly && styles.toggleButtonActive
          ]}
          onPress={() => updateFormData('petFriendly', !formData.petFriendly)}
        >
          <Text style={[
            styles.toggleButtonText,
            formData.petFriendly && styles.toggleButtonTextActive
          ]}>
            Pet Friendly
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Photos & Final Details</Text>
      
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Property Photos</Text>
        <View style={styles.imagesContainer}>
          {formData.images.map((image, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: image }} style={styles.propertyImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <X size={16} color={Colors.white} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
            <Camera size={24} color={Colors.secondaryText} strokeWidth={2} />
            <Text style={styles.addImageText}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Status</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'Active' && styles.statusButtonActive
            ]}
            onPress={() => updateFormData('status', 'Active')}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'Active' && styles.statusButtonTextActive
            ]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'Inactive' && styles.statusButtonActive
            ]}
            onPress={() => updateFormData('status', 'Inactive')}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'Inactive' && styles.statusButtonTextActive
            ]}>
              Draft
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Property</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <Button
            title="Previous"
            onPress={handlePrevious}
            variant="outline"
            style={styles.navButton}
          />
        )}
        {currentStep < 4 ? (
          <Button
            title="Next"
            onPress={handleNext}
            style={[styles.navButton, currentStep === 1 && styles.fullWidthButton]}
          />
        ) : (
          <Button
            title="Add Property"
            onPress={handleSubmit}
            loading={loading}
            style={styles.navButton}
          />
        )}
      </View>
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

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  stepCircleCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepNumber: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.secondaryText,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  stepLineCompleted: {
    backgroundColor: Colors.success,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: Layout.screenPadding,
  },
  stepTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },

  // Form Fields
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.secondaryText,
    marginBottom: Spacing.sm,
  },
  textArea: {
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
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rowItem: {
    flex: 1,
  },

  // Options
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
  },
  optionButtonActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  optionButtonText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },
  optionButtonTextActive: {
    color: Colors.white,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    gap: Spacing.xs,
  },
  amenityButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  amenityButtonText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },
  amenityButtonTextActive: {
    color: Colors.white,
  },

  // Toggle Buttons
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  toggleButtonText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  toggleButtonTextActive: {
    color: Colors.white,
  },

  // Images
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  imageItem: {
    position: 'relative',
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 2,
  },

  // Status
  statusButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statusButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  statusButtonText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  statusButtonTextActive: {
    color: Colors.white,
  },

  // Navigation
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    marginTop: 0,
  },
  fullWidthButton: {
    flex: 1,
  },
});