import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MapPin, Navigation, Maximize2 } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';

const { width: screenWidth } = Dimensions.get('window');

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  address: string;
  title?: string;
  style?: any;
  height?: number;
  showControls?: boolean;
}

// Mock map component since we can't use actual maps in this environment
export function MapView({ 
  latitude = 6.4281, 
  longitude = 3.4219, 
  address, 
  title,
  style,
  height = 200,
  showControls = true 
}: MapViewProps) {
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const handleDirections = () => {
    console.log('Opening directions to:', address);
    // In real app, this would open native maps app
  };

  const handleFullscreen = () => {
    console.log('Opening fullscreen map');
    // In real app, this would open fullscreen map view
  };

  return (
    <View style={[styles.container, { height }, style]}>
      {/* Mock Map Display */}
      <View style={[styles.mapContainer, { backgroundColor: mapType === 'satellite' ? '#2D5A27' : '#E8F4FD' }]}>
        <View style={styles.mapContent}>
          <MapPin size={32} color={Colors.accent} strokeWidth={2} />
          <Text style={styles.mapTitle}>{title || 'Property Location'}</Text>
          <Text style={styles.mapAddress}>{address}</Text>
          <Text style={styles.coordinates}>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>

        {/* Map Type Toggle */}
        {showControls && (
          <View style={styles.mapTypeToggle}>
            <TouchableOpacity
              style={[styles.mapTypeButton, mapType === 'standard' && styles.mapTypeButtonActive]}
              onPress={() => setMapType('standard')}
            >
              <Text style={[styles.mapTypeText, mapType === 'standard' && styles.mapTypeTextActive]}>
                Map
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mapTypeButton, mapType === 'satellite' && styles.mapTypeButtonActive]}
              onPress={() => setMapType('satellite')}
            >
              <Text style={[styles.mapTypeText, mapType === 'satellite' && styles.mapTypeTextActive]}>
                Satellite
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Map Controls */}
        {showControls && (
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.controlButton} onPress={handleDirections}>
              <Navigation size={16} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleFullscreen}>
              <Maximize2 size={16} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Address Bar */}
      <View style={styles.addressBar}>
        <MapPin size={16} color={Colors.secondaryText} strokeWidth={2} />
        <Text style={styles.addressText} numberOfLines={2}>
          {address}
        </Text>
      </View>
    </View>
  );
}

interface NearbyPlacesProps {
  places: Array<{
    name: string;
    type: string;
    distance: string;
    coordinates?: { lat: number; lng: number };
  }>;
}

export function NearbyPlaces({ places }: NearbyPlacesProps) {
  return (
    <View style={styles.nearbyContainer}>
      <Text style={styles.nearbyTitle}>Nearby Places</Text>
      <View style={styles.nearbyList}>
        {places.map((place, index) => (
          <TouchableOpacity key={index} style={styles.nearbyItem}>
            <View style={styles.nearbyInfo}>
              <Text style={styles.nearbyName}>{place.name}</Text>
              <Text style={styles.nearbyType}>{place.type}</Text>
            </View>
            <Text style={styles.nearbyDistance}>{place.distance}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  mapAddress: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: Spacing.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  coordinates: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: Spacing.xs,
  },
  mapTypeToggle: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
  },
  mapTypeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  mapTypeButtonActive: {
    backgroundColor: Colors.accent,
  },
  mapTypeText: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  mapTypeTextActive: {
    color: Colors.white,
  },
  mapControls: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    gap: Spacing.xs,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addressText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    marginLeft: Spacing.xs,
    flex: 1,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.relaxed,
  },
  
  // Nearby Places
  nearbyContainer: {
    marginTop: Spacing.lg,
  },
  nearbyTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
  },
  nearbyList: {
    gap: Spacing.sm,
  },
  nearbyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
  },
  nearbyType: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  nearbyDistance: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.accent,
  },
});