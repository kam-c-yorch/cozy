import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Sliders } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Typography, getResponsiveFontSize } from '../../constants/Typography';
import { Layout, Spacing } from '../../constants/Spacing';
import { Button } from '../../components/ui/Button';

const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Duplex'];
const priceRanges = ['Any', '₦500K - ₦1M', '₦1M - ₦3M', '₦3M - ₦5M', '₦5M+'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Any');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    console.log('Search:', { searchQuery, selectedType, selectedPriceRange });
    // Implement search logic
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Properties</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.secondaryText} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location, property type..."
              placeholderTextColor={Colors.placeholderText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Sliders size={20} color={Colors.primaryText} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersSection}>
            {/* Property Type */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Property Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterOption,
                        selectedType === type && styles.filterOptionActive,
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedType === type && styles.filterOptionTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Price Range */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterOptions}>
                  {priceRanges.map((range) => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.filterOption,
                        selectedPriceRange === range && styles.filterOptionActive,
                      ]}
                      onPress={() => setSelectedPriceRange(range)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedPriceRange === range && styles.filterOptionTextActive,
                        ]}
                      >
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Search Button */}
        <View style={styles.searchButtonContainer}>
          <Button
            title="Search Properties"
            onPress={handleSearch}
            style={styles.searchButton}
          />
        </View>

        {/* Quick Filters */}
        <View style={styles.quickFiltersSection}>
          <Text style={styles.sectionTitle}>Popular Locations</Text>
          <View style={styles.quickFilters}>
            {['Victoria Island', 'Lekki', 'Ikeja', 'Magodo', 'Ajah', 'Ikoyi'].map((location) => (
              <TouchableOpacity key={location} style={styles.quickFilter}>
                <MapPin size={14} color={Colors.accent} strokeWidth={2} />
                <Text style={styles.quickFilterText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentSearches}>
            {['3 bedroom apartment Lekki', '2 bedroom flat Ikeja', 'Villa Victoria Island'].map((search, index) => (
              <TouchableOpacity key={index} style={styles.recentSearch}>
                <Search size={16} color={Colors.secondaryText} strokeWidth={2} />
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('title') * Typography.lineHeight.normal,
  },
  
  // Content
  scrollView: {
    flex: 1,
  },
  
  // Search Section
  searchSection: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    marginLeft: Spacing.sm,
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.normal,
  },
  filterButton: {
    padding: Spacing.xs,
  },
  
  // Filters
  filtersSection: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.lg,
  },
  filterGroup: {
    marginBottom: Spacing.lg,
  },
  filterLabel: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.primaryText,
    marginBottom: Spacing.sm,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOptionActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  filterOptionText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  filterOptionTextActive: {
    color: Colors.white,
  },
  
  // Search Button
  searchButtonContainer: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  searchButton: {
    marginTop: 0,
  },
  
  // Quick Filters
  quickFiltersSection: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
    lineHeight: getResponsiveFontSize('subtitle') * Typography.lineHeight.normal,
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickFilterText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    marginLeft: Spacing.xs,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
  
  // Recent Searches
  recentSection: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  recentSearches: {
    gap: Spacing.sm,
  },
  recentSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentSearchText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.normal,
  },
});