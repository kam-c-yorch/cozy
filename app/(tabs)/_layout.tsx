import { Tabs } from 'expo-router';
import { Chrome as Home, Search, User, Building2, Users, ChartBar as BarChart3 } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { getResponsiveFontSize } from '../../constants/Typography';

interface TabLayoutProps {
  userRole: 'realtor' | 'home_seeker';
}

export default function TabLayout({ userRole }: TabLayoutProps) {
  const isRealtor = userRole === 'realtor';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.secondaryText,
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
            name="analytics"
            options={{
              title: 'Analytics',
              tabBarIcon: ({ color, size }) => (
                <BarChart3 size={size} color={color} strokeWidth={2} />
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