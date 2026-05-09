import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';

const FEATURES = [
  {
    id: 'chat',
    icon: '💬',
    title: 'Plant Doctor',
    subtitle: 'AI-powered diagnosis',
    description: 'Describe your plant\'s symptoms and get instant diagnosis, treatment plans, and prevention tips from our plant AI.',
    color: colors.aiPurple,
    bgColor: colors.aiPurpleLight,
    screen: 'AIChat',
    tag: 'Most Popular',
  },
  {
    id: 'finder',
    icon: '🔍',
    title: 'Plant Finder Quiz',
    subtitle: '5-question personalised match',
    description: 'Answer 5 quick questions about your lifestyle, space, and experience. Get matched with your perfect plants.',
    color: colors.forest,
    bgColor: colors.mint,
    screen: 'PlantFinder',
    tag: 'New',
  },
  {
    id: 'care',
    icon: '📅',
    title: 'Care Scheduler',
    subtitle: 'Personalised reminders',
    description: 'Our AI builds a custom watering and fertilising schedule for every plant in your collection.',
    color: colors.amber,
    bgColor: colors.amberLight,
    screen: 'AIChat',
    tag: 'Coming Soon',
    comingSoon: true,
  },
  {
    id: 'identify',
    icon: '📸',
    title: 'Plant Identifier',
    subtitle: 'Instant recognition',
    description: 'Point your camera at any plant and our AI identifies it instantly — plus full care instructions.',
    color: colors.coral,
    bgColor: '#FFF3F0',
    screen: 'AIChat',
    tag: 'Beta',
    comingSoon: true,
  },
];

const AI_TIPS = [
  { emoji: '🌡', tip: 'Most houseplants prefer temperatures between 15–24°C. Keep them away from cold windows.' },
  { emoji: '💧', tip: 'When in doubt, don\'t water. Overwatering kills more houseplants than anything else.' },
  { emoji: '☀️', tip: 'No plant truly thrives in zero light. Even "low light" plants need some indirect light.' },
  { emoji: '🪲', tip: 'Inspect new plants for pests before bringing them home. Quarantine for 2 weeks.' },
];

export default function AIHubScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 0) }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>AI Plant Hub</Text>
            <Text style={styles.headerSub}>Powered by plant intelligence</Text>
          </View>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>🤖 AI</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🌿🤖</Text>
          <Text style={styles.heroTitle}>Your Personal{'\n'}Plant Expert</Text>
          <Text style={styles.heroText}>
            Our AI has been trained on thousands of plant species, care guides, and real grower experiences to give you the best possible advice.
          </Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigation.navigate('AIChat')}
          >
            <Text style={styles.heroBtnText}>💬 Ask the Plant Doctor</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Tools</Text>
          {FEATURES.map(feature => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { backgroundColor: feature.bgColor }]}
              onPress={() => !feature.comingSoon && navigation.navigate(feature.screen)}
              activeOpacity={feature.comingSoon ? 1 : 0.85}
            >
              <View style={styles.featureLeft}>
                <View style={[styles.featureIconBox, { backgroundColor: feature.color }]}>
                  <Text style={{ fontSize: 24 }}>{feature.icon}</Text>
                </View>
                <View style={styles.featureText}>
                  <View style={styles.featureTitleRow}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <View style={[styles.featureTag, feature.comingSoon && styles.comingSoonTag]}>
                      <Text style={[styles.featureTagText, feature.comingSoon && styles.comingSoonTagText]}>
                        {feature.tag}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                  <Text style={styles.featureDesc} numberOfLines={2}>{feature.description}</Text>
                </View>
              </View>
              {!feature.comingSoon && (
                <Text style={[styles.featureArrow, { color: feature.color }]}>→</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌱 Today's Plant Tips</Text>
          {AI_TIPS.map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <Text style={styles.tipEmoji}>{tip.emoji}</Text>
              <Text style={styles.tipText}>{tip.tip}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['98%', 'Diagnosis Accuracy'], ['50K+', 'Plants Identified'], ['200+', 'Species in Database']].map(([val, label]) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surface, paddingHorizontal: 20,
    paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  aiBadge: {
    backgroundColor: colors.aiPurple, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  aiBadgeText: { color: colors.white, fontWeight: '700', fontSize: 13 },

  hero: {
    backgroundColor: colors.aiPurple, margin: 16, borderRadius: 20,
    padding: 24, alignItems: 'center', ...shadows.lg,
  },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: { color: colors.white, fontSize: 26, fontWeight: '800', textAlign: 'center', lineHeight: 32, marginBottom: 10 },
  heroText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  heroBtn: {
    backgroundColor: colors.white, borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 14,
  },
  heroBtnText: { color: colors.aiPurple, fontWeight: '700', fontSize: 15 },

  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 14, marginTop: 8 },

  featureCard: {
    borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...shadows.sm,
  },
  featureLeft: { flexDirection: 'row', gap: 14, flex: 1 },
  featureIconBox: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  featureText: { flex: 1 },
  featureTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  featureTag: {
    backgroundColor: colors.forest, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  comingSoonTag: { backgroundColor: colors.surfaceAlt },
  featureTagText: { fontSize: 9, color: colors.white, fontWeight: '700' },
  comingSoonTagText: { color: colors.textLight },
  featureSubtitle: { fontSize: 12, color: colors.textLight, marginBottom: 4 },
  featureDesc: { fontSize: 12, color: colors.textMed, lineHeight: 17 },
  featureArrow: { fontSize: 22, fontWeight: '600', marginLeft: 8 },

  tipCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 8, ...shadows.sm,
  },
  tipEmoji: { fontSize: 20, marginTop: 2 },
  tipText: { flex: 1, fontSize: 13, color: colors.textMed, lineHeight: 19 },

  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 8, marginBottom: 8 },
  statCard: {
    flex: 1, backgroundColor: colors.forest, borderRadius: 14,
    padding: 16, alignItems: 'center',
  },
  statVal: { color: colors.white, fontSize: 20, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, textAlign: 'center', lineHeight: 13 },
});
