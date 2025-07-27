@@ .. @@
 import React, { useState } from 'react';
 import { View, Text, StyleSheet, Alert } from 'react-native';
-import { account, ID } from '../../lib/appwrite';
+import { signUp, signIn, resetPassword } from '../../lib/auth';
 import { Button } from '../ui/Button';
@@ .. @@
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
+  const [resetEmailSent, setResetEmailSent] = useState(false);
 
   const validateForm = () => {
@@ .. @@
   const handleSubmit = async () => {
     if (!validateForm()) return;
+    if (!selectedRole && !isLogin) {
+      setErrors({ role: 'Please select your role' });
+      return;
+    }
 
     setLoading(true);
     setErrors({});
 
     try {
       if (isLogin) {
-        // Login logic
-        const session = await account.createEmailPasswordSession(
-          formData.email,
-          formData.password
-        );
-        
-        if (session) {
-          onAuthSuccess('home_seeker'); // Default for now, will be determined from user profile
+        const result = await signIn(formData.email, formData.password);
+        if (result.user && result.profile) {
+          onAuthSuccess(result.profile.role);
         }
       } else {
-        // Sign up logic
-        const user = await account.create(
-          ID.unique(),
-          formData.email,
-          formData.password
-        );
-        
-        if (user) {
-          // Create session after signup
-          await account.createEmailPasswordSession(
-            formData.email,
-            formData.password
-          );
-          onAuthSuccess(selectedRole || 'home_seeker');
+        const result = await signUp(formData.email, formData.password, selectedRole!);
+        if (result.user && result.profile) {
+          onAuthSuccess(result.profile.role);
         }
       }
     } catch (error: any) {
-      console.error('Auth error:', error);
-      setErrors({ 
-        general: error.message || 'Authentication failed. Please try again.' 
-      });
+      let errorMessage = 'Authentication failed. Please try again.';
+      
+      if (error.message.includes('Invalid login credentials')) {
+        errorMessage = 'Invalid email or password';
+      } else if (error.message.includes('User already registered')) {
+        errorMessage = 'Email already exists';
+      } else if (error.message.includes('Password should be at least')) {
+        errorMessage = 'Password must be at least 6 characters';
+      } else if (error.message) {
+        errorMessage = error.message;
+      }
+      
+      setErrors({ general: errorMessage });
     } finally {
       setLoading(false);
     }
   };
 
+  const handleForgotPassword = async () => {
+    if (!formData.email) {
+      setErrors({ email: 'Please enter your email address' });
+      return;
+    }
+
+    try {
+      await resetPassword(formData.email);
+      setResetEmailSent(true);
+    } catch (error: any) {
+      setErrors({ general: error.message || 'Failed to send reset email' });
+    }
+  };
+
   return (
@@ .. @@
       {errors.general && (
         <Text style={styles.errorText}>{errors.general}</Text>
       )}
+      
+      {resetEmailSent && (
+        <Text style={styles.successText}>
+          Password reset email sent! Check your inbox.
+        </Text>
+      )}
 
       {!isLogin && (
@@ .. @@
       {isLogin && (
         <Button
           title="Forgot Password?"
-          onPress={() => Alert.alert('Forgot Password', 'Password reset functionality will be implemented')}
+          onPress={handleForgotPassword}
           variant="outline"
@@ .. @@
     marginBottom: 16,
     lineHeight: 16,
   },
+  successText: {
+    fontSize: 12,
+    fontFamily: 'Inter-Regular',
+    color: '#228B22',
+    textAlign: 'center',
+    marginBottom: 16,
+    lineHeight: 16,
+  },
 });