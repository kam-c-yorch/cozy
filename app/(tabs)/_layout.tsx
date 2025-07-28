import { Tabs } from 'expo-router';
import { Home, Search, User, Building2, MessageSquare, BarChart3 } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { getResponsiveFontSize } from '../../constants/Typography';
import { useEffect, useState } from 'react';
import { getCurrentUserProfile } from '../../lib/auth';

export default function TabLayout() {
  const [userRole, setUserRole] = useState<'realtor' | 'home_seeker'>('home_seeker');

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const userProfile = await getCurrentUserProfile();
      if (userProfile?.profile?.role) {
        setUserRole(userProfile.profile.role);
      }
    } catch (error) {
      console.error('Failed to load user role:', error);
    }
  };

  const isRealtor = userRole === 'realtor';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.primaryText,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: getResponsiveFontSize('small'),
          fontFamily: 'Inter-SemiBold',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      
      {isRealtor ? (
        <>
          <Tabs.Screen
            name="listings"
            options={{
              title: 'Listings',
              tabBarIcon: ({ color, size }) => (
                <Building2 size={size} color={color} strokeWidth={2} />
              ),
            }}
          />
          <Tabs.Screen
            name="leads"
            options={{
              title: 'Leads',
              tabBarIcon: ({ color, size }) => (
                <MessageSquare size={size} color={color} strokeWidth={2} />
              ),
            }}
          />
        </>
      ) : (
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Search size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      )}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}