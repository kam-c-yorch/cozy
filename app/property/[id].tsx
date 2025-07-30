import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  MessageSquare,
  Calendar,
  Wifi,
  Car,
  Shield,
  Zap,
  Wind,
  TreePine,
  Dumbbell,
  Waves
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { Button } from '../../components/ui/Button';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock property data - in real app this would come from API
const mockPropertyDetails = {
  '1': {
    id: '1',
    title: 'Modern 3BR Apartment',
    location: 'Victoria Island, Lagos',
    fullAddress: '15 Ahmadu Bello Way, Victoria Island, Lagos State',
    price: '₦2,500,000',
    period: '/month',
    beds: 3,
    baths: 2,
    area: '120',
    description: 'Beautiful modern apartment in the heart of Victoria Island. This spacious 3-bedroom, 2-bathroom unit features contemporary finishes, floor-to-ceiling windows, and stunning city views. Perfect for professionals and families looking for luxury living in Lagos premier business district.',
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: [
      { name: 'WiFi', icon: <Wifi size={20} color={Colors.accent} strokeWidth={2} /> },
      { name: 'Parking', icon: <Car size={20} color={Colors.accent} strokeWidth={2} /> },
      { name: '24/7 Security', icon: <Shield size={20} color={Colors.accent} strokeWidth={2} /> },
      { name: 'Generator', icon: <Zap size={20} color={Colors.accent} strokeWidth={2} /> },
      { name: 'Air Conditioning', icon: <Wind size={20} color={Colors.accent} strokeWidth={2} /> },
      { name: 'Garden', icon: <TreePine size={20} color={Colors.accent} strokeWidth={2} /> },
      { name: 'Gym', icon: <Dumbbell size={20} color={Colors.accent} strokeWidth={2} /> },
      { name: 'Swimming Pool', icon: <Waves size={20} color={Colors.accent} strokeWidth={2} /> },
    ],
    realtor: {
      name: 'Sarah Johnson',
      company: 'Premium Properties Ltd',
      phone: '+234 801 234 5678',
      email: 'sarah@premiumproperties.ng',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
      rating: 4.8,
      properties: 45,
    },
    features: [
      'Fully Furnished',
      'Modern Kitchen',
      'Master En-suite',
      'Balcony with City View',
      'Marble Floors',
      'Built-in Wardrobes',
      'Elevator Access',
      'Backup Water Supply',
    ],
    nearbyPlaces: [
      { name: 'Tafawa Balewa Square', distance: '0.5 km', type: 'Landmark' },
      { name: 'Lagos Island Club', distance: '0.8 km', type: 'Recreation' },
      { name: 'Federal Palace Hotel', distance: '1.2 km', type: 'Hotel' },
      { name: 'National Theatre', distance: '2.1 km', type: 'Culture' },
    ],
    status: 'Available',
    datePosted: '2024-01-15',
    propertyType: 'Apartment',
    furnished: true,
    petFriendly: false,
  },
};

interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

function ImageGallery({ images, currentIndex, onIndexChange }: ImageGalleryProps) {
  return (
    <View style={styles.imageGallery}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          onIndexChange(index);
        }}
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.propertyImage} />
        ))}
      </ScrollView>
      
      {/* Image Indicators */}
      <View style={styles.imageIndicators}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.imageIndicator,
              currentIndex === index && styles.imageIndicatorActive,
            ]}
          />
        ))}
      </View>
      
      {/* Image Counter */}
      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>
          {currentIndex + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
}

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPropertyDetails();
  }, [id]);

  const loadPropertyDetails = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        const propertyData = mockPropertyDetails[id as string];
        setProperty(propertyData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load property details:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Save to favorites
  };

  const handleShare = () => {
    Alert.alert('Share Property', 'Share functionality would be implemented here');
  };

  const handleContact = (method: 'phone' | 'message') => {
    if (method === 'phone') {
      Alert.alert('Call Realtor', `Call ${property.realtor.name}?`);
    } else {
      Alert.alert('Send Message', 'Message functionality would be implemented here');
    }
  };

  const handleScheduleViewing = () => {
    Alert.alert('Schedule Viewing', 'Viewing scheduler would be implemented here');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading property details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Property not found</Text>
          <Button title="Go Back" onPress={handleBack} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <ArrowLeft size={24} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={24} color={Colors.white} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleFavorite}>
            <Heart 
              size={24} 
              color={isFavorite ? Colors.accent : Colors.white} 
              strokeWidth={2}
              fill={isFavorite ? Colors.accent : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ImageGallery
          images={property.images}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
        />

        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <View style={styles.propertyHeader}>
            <View style={styles.propertyTitleSection}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color={Colors.secondaryText} strokeWidth={2} />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.price}>{property.price}</Text>
              <Text style={styles.period}>{property.period}</Text>
            </View>
          </View>

          {/* Property Details */}
          <View style={styles.propertyDetails}>
            <View style={styles.detailItem}>
              <Bed size={20} color={Colors.secondaryText} strokeWidth={2} />
              <Text style={styles.detailText}>{property.beds} Bedrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Bath size={20} color={Colors.secondaryText} strokeWidth={2} />
              <Text style={styles.detailText}>{property.baths} Bathrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Square size={20} color={Colors.secondaryText} strokeWidth={2} />
              <Text style={styles.detailText}>{property.area} sqm</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              {property.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>• {feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity: any, index: number) => (
                <View key={index} style={styles.amenityItem}>
                  {amenity.icon}
                  <Text style={styles.amenityText}>{amenity.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Nearby Places */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nearby Places</Text>
            <View style={styles.nearbyPlaces}>
              {property.nearbyPlaces.map((place: any, index: number) => (
                <View key={index} style={styles.nearbyPlace}>
                  <View style={styles.nearbyPlaceInfo}>
                    <Text style={styles.nearbyPlaceName}>{place.name}</Text>
                    <Text style={styles.nearbyPlaceType}>{place.type}</Text>
                  </View>
                  <Text style={styles.nearbyPlaceDistance}>{place.distance}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Realtor Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed by</Text>
            <View style={styles.realtorCard}>
              <Image source={{ uri: property.realtor.avatar }} style={styles.realtorAvatar} />
              <View style={styles.realtorInfo}>
                <Text style={styles.realtorName}>{property.realtor.name}</Text>
                <Text style={styles.realtorCompany}>{property.realtor.company}</Text>
                <Text style={styles.realtorStats}>
                  ⭐ {property.realtor.rating} • {property.realtor.properties} properties
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleContact('phone')}
        >
          <Phone size={20} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleContact('message')}
        >
          <MessageSquare size={20} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
        <Button
          title="Schedule Viewing"
          onPress={handleScheduleViewing}
          style={styles.scheduleButton}
        />
      </View>
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
    padding: Layout.screenPadding,
  },
  errorText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.error,
    marginBottom: Spacing.lg,
  },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 50,
    paddingBottom: Spacing.md,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Content
  scrollView: {
    flex: 1,
  },

  // Image Gallery
  imageGallery: {
    height: screenHeight * 0.4,
    position: 'relative',
  },
  propertyImage: {
    width: screenWidth,
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageIndicatorActive: {
    backgroundColor: Colors.white,
  },
  imageCounter: {
    position: 'absolute',
    top: Spacing.md + 50,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  imageCounterText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.white,
  },

  // Property Info
  propertyInfo: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    marginTop: -20,
    paddingTop: Spacing.lg,
    paddingHorizontal: Layout.screenPadding,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  propertyTitleSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  propertyTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: Spacing.xs,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.accent,
  },
  period: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },

  // Property Details
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  detailItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },

  // Sections
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.relaxed,
  },

  // Features
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    width: '50%',
    marginBottom: Spacing.xs,
  },
  featureText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Layout.borderRadius.md,
    gap: Spacing.xs,
  },
  amenityText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },

  // Nearby Places
  nearbyPlaces: {
    gap: Spacing.sm,
  },
  nearbyPlace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nearbyPlaceInfo: {
    flex: 1,
  },
  nearbyPlaceName: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  nearbyPlaceType: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
  },
  nearbyPlaceDistance: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.accent,
  },

  // Realtor
  realtorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.lg,
  },
  realtorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
  },
  realtorInfo: {
    flex: 1,
  },
  realtorName: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
  },
  realtorCompany: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginVertical: 2,
  },
  realtorStats: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.accent,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleButton: {
    flex: 1,
    marginTop: 0,
  },
});