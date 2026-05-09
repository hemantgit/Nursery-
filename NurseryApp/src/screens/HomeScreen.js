import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/colors';

const FEATURED_PLANTS = [
  { id: '1', name: 'Monstera Deliciosa', price: '$25', category: 'Indoor', emoji: '🌿' },
  { id: '2', name: 'Peace Lily', price: '$18', category: 'Indoor', emoji: '🌸' },
  { id: '3', name: 'Snake Plant', price: '$22', category: 'Indoor', emoji: '🌱' },
  { id: '4', name: 'Rose Bush', price: '$30', category: 'Outdoor', emoji: '🌹' },
  { id: '5', name: 'Lavender', price: '$15', category: 'Outdoor', emoji: '💜' },
  { id: '6', name: 'Fiddle Leaf Fig', price: '$45', category: 'Indoor', emoji: '🍃' },
];

const CATEGORIES = ['All', 'Indoor', 'Outdoor', 'Succulents', 'Trees'];

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filtered = selectedCategory === 'All'
    ? FEATURED_PLANTS
    : FEATURED_PLANTS.filter(p => p.category === selectedCategory);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.headerTitle}>Find your perfect plant</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTitle}>🌿 Spring Sale!</Text>
          <Text style={styles.bannerSubtitle}>Up to 30% off on all plants</Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Shop Now</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Featured Plants</Text>
        <View style={styles.plantsGrid}>
          {filtered.map(plant => (
            <TouchableOpacity
              key={plant.id}
              style={styles.plantCard}
              onPress={() => navigation.navigate('Plants')}
            >
              <View style={styles.plantEmoji}>
                <Text style={styles.plantEmojiText}>{plant.emoji}</Text>
              </View>
              <Text style={styles.plantCategory}>{plant.category}</Text>
              <Text style={styles.plantName}>{plant.name}</Text>
              <View style={styles.plantFooter}>
                <Text style={styles.plantPrice}>{plant.price}</Text>
                <TouchableOpacity style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'web' ? 24 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  cartBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 20,
  },
  bannerCard: {
    backgroundColor: colors.primaryLight,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  bannerBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  bannerBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  categoryScroll: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.white,
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  plantCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    margin: 6,
    padding: 14,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  plantEmoji: {
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  plantEmojiText: {
    fontSize: 40,
  },
  plantCategory: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  plantName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  plantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantPrice: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  bottomPad: {
    height: 20,
  },
});
