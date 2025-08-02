import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Crown, 
  Zap,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { Typography, getResponsiveFontSize } from '../constants/Typography';
import { Layout, Spacing } from '../constants/Spacing';
import { Button } from '../components/ui/Button';
import { getCurrentUserProfile } from '../lib/auth';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: PlanFeature[];
  color: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₦0',
    period: '/month',
    description: 'Perfect for getting started',
    icon: <Shield size={24} color={Colors.secondaryText} strokeWidth={2} />,
    color: Colors.secondaryText,
    features: [
      { text: 'List up to 3 properties', included: true },
      { text: 'Basic property photos', included: true },
      { text: 'Standard support', included: true },
      { text: 'Featured listings', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '₦15,000',
    period: '/month',
    description: 'Best for growing realtors',
    icon: <Star size={24} color={Colors.accent} strokeWidth={2} />,
    popular: true,
    color: Colors.accent,
    features: [
      { text: 'List up to 25 properties', included: true },
      { text: 'High-quality property photos', included: true },
      { text: 'Featured listings (5/month)', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced analytics', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₦35,000',
    period: '/month',
    description: 'For established agencies',
    icon: <Crown size={24} color={Colors.success} strokeWidth={2} />,
    color: Colors.success,
    features: [
      { text: 'Unlimited property listings', included: true },
      { text: 'Professional photography', included: true },
      { text: 'Unlimited featured listings', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
    ],
  },
];

export default function SubscriptionScreen() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('basic');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getCurrentUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === currentPlan) {
      Alert.alert('Info', 'You are already subscribed to this plan');
      return;
    }

    setLoading(true);
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Subscription Successful',
        `You have successfully subscribed to the ${subscriptionPlans.find(p => p.id === planId)?.name} plan!`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PlanCard = ({ plan }: { plan: SubscriptionPlan }) => (
    <View style={[
      styles.planCard,
      selectedPlan === plan.id && styles.planCardSelected,
      plan.popular && styles.planCardPopular,
    ]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Most Popular</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={styles.planHeader}
        onPress={() => setSelectedPlan(plan.id)}
      >
        <View style={styles.planIconContainer}>
          {plan.icon}
        </View>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planDescription}>{plan.description}</Text>
        
        <View style={styles.planPricing}>
          <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
          <Text style={styles.planPeriod}>{plan.period}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.planFeatures}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.planFeature}>
            <Check 
              size={16} 
              color={feature.included ? Colors.success : Colors.border} 
              strokeWidth={2} 
            />
            <Text style={[
              styles.planFeatureText,
              !feature.included && styles.planFeatureTextDisabled,
            ]}>
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      <Button
        title={currentPlan === plan.id ? 'Current Plan' : 'Choose Plan'}
        onPress={() => handleSubscribe(plan.id)}
        disabled={currentPlan === plan.id}
        loading={loading && selectedPlan === plan.id}
        variant={plan.popular ? 'primary' : 'outline'}
        style={styles.planButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.primaryText} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Zap size={48} color={Colors.accent} strokeWidth={2} />
          <Text style={styles.heroTitle}>Boost Your Real Estate Business</Text>
          <Text style={styles.heroSubtitle}>
            Choose the perfect plan to showcase your properties and connect with more clients
          </Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why upgrade?</Text>
          <View style={styles.benefits}>
            <View style={styles.benefit}>
              <TrendingUp size={20} color={Colors.accent} strokeWidth={2} />
              <Text style={styles.benefitText}>Increase property visibility</Text>
            </View>
            <View style={styles.benefit}>
              <Users size={20} color={Colors.accent} strokeWidth={2} />
              <Text style={styles.benefitText}>Connect with more clients</Text>
            </View>
            <View style={styles.benefit}>
              <Star size={20} color={Colors.accent} strokeWidth={2} />
              <Text style={styles.benefitText}>Professional branding</Text>
            </View>
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          {subscriptionPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All plans include secure payment processing and can be cancelled anytime.
          </Text>
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

  // Content
  scrollView: {
    flex: 1,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('body') * Typography.lineHeight.relaxed,
  },

  // Benefits Section
  benefitsSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  benefitsTitle: {
    fontSize: getResponsiveFontSize('subtitle'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.md,
  },
  benefits: {
    gap: Spacing.sm,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
  },

  // Plans Section
  plansSection: {
    paddingHorizontal: Layout.screenPadding,
    gap: Spacing.md,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.accent,
  },
  planCardPopular: {
    borderColor: Colors.accent,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xs,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
    textAlign: 'center',
  },
  planHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  planIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  planName: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryText,
    marginBottom: Spacing.xs,
  },
  planDescription: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: getResponsiveFontSize('title'),
    fontFamily: Typography.fontFamily.bold,
  },
  planPeriod: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    marginLeft: Spacing.xs,
  },

  // Plan Features
  planFeatures: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planFeatureText: {
    fontSize: getResponsiveFontSize('body'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.primaryText,
    flex: 1,
  },
  planFeatureTextDisabled: {
    color: Colors.secondaryText,
    textDecorationLine: 'line-through',
  },
  planButton: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  // Footer
  footer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: getResponsiveFontSize('small'),
    fontFamily: Typography.fontFamily.regular,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: getResponsiveFontSize('small') * Typography.lineHeight.relaxed,
  },
});