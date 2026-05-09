import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';

const PLANTS = [
  { id: '1', name: 'Monstera Deliciosa', price: 25, category: 'Indoor', care: 'Easy', light: '☀️ Indirect', water: '💧 Weekly', emoji: '🌿', desc: 'A popular tropical plant known for its unique leaf holes.' },
  { id: '2', name: 'Peace Lily', price: 18, category: 'Indoor', care: 'Easy', light: '🌥 Low', water: '💧 Weekly', emoji: '🌸', desc: 'Elegant white blooms that thrive in low-light conditions.' },
  { id: '3', name: 'Snake Plant', price: 22, category: 'Indoor', care: 'Very Easy', light: '☀️ Any', water: '💧 Monthly', emoji: '🌱', desc: 'Nearly indestructible and great for air purification.' },
  { id: '4', name: 'Rose Bush', price: 30, category: 'Outdoor', care: 'Moderate', light: '☀️ Full Sun', water: '💧 Bi-weekly', emoji: '🌹', desc: 'Classic garden rose with fragrant blooms.' },
  { id: '5', name: 'Lavender', price: 15, category: 'Outdoor', care: 'Easy', light: '☀️ Full Sun', water: '💧 Low', emoji: '💜', desc: 'Aromatic herb with beautiful purple flowers.' },
  { id: '6', name: 'Fiddle Leaf Fig', price: 45, category: 'Indoor', care: 'Moderate', light: '☀️ Bright', water: '💧 Weekly', emoji: '🍃', desc: 'Statement plant with large, dramatic leaves.' },
  { id: '7', name: 'Cactus Mix', price: 12, category: 'Succulents', care: 'Very Easy', light: '☀️ Full Sun', water: '💧 Monthly', emoji: '🌵', desc: 'Low-maintenance desert beauties.' },
  { id: '8', name: 'Aloe Vera', price: 14, category: 'Succulents', care: 'Very Easy', light: '☀️ Bright', water: '💧 Monthly', emoji: '🪴', desc: 'Medicinal succulent with thick, fleshy leaves.' },
];

export default function PlantsScreen() {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [cart, setCart] = useState({});

  const filters = ['All', 'Indoor', 'Outdoor', 'Succulents'];

  const filtered = PLANTS.filter(p => {
    const matchCat = selectedFilter === 'All' || p.category === selectedFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plant Catalog</Text>
        <Text style={styles.headerSub}>{PLANTS.length} plants available</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search plants..."
          placeholderTextColor={colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
            onPress={() => setSelectedFilter(f)}
          >
            <Text style={[styles.filterText, selectedFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map(plant => (
          <View key={plant.id} style={styles.card}>
            <View style={styles.cardEmoji}>
              <Text style={styles.emojiText}>{plant.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.plantName}>{plant.name}</Text>
                  <Text style={styles.plantDesc}>{plant.desc}</Text>
                </View>
                <Text style={styles.plantPrice}>${plant.price}</Text>
              </View>
              <View style={styles.tags}>
                <View style={styles.tag}><Text style={styles.tagText}>{plant.light}</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>{plant.water}</Text></View>
                <View style={[styles.tag, styles.careTag]}>
                  <Text style={styles.careText}>{plant.care}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.addBtn, cart[plant.id] && styles.addedBtn]}
                onPress={() => addToCart(plant.id)}
              >
                <Text style={styles.addBtnText}>
                  {cart[plant.id] ? `Added (${cart[plant.id]}) ✓` : '+ Add to Cart'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'web' ? 24 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { color: colors.white, fontSize: 24, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  filterRow: { paddingHorizontal: 12, marginBottom: 8 },
  filterChip: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textLight, fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: colors.white },
  list: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardEmoji: {
    backgroundColor: colors.background,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: { fontSize: 40 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  plantName: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
  plantDesc: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  plantPrice: { fontSize: 18, fontWeight: '700', color: colors.primary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 },
  tag: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: colors.textLight },
  careTag: { backgroundColor: '#E8F5E9' },
  careText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addedBtn: { backgroundColor: colors.success },
  addBtnText: { color: colors.white, fontWeight: '600', fontSize: 13 },
});
