import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { BLOG_POSTS } from '../data/blogPosts';

const BLOG_CATEGORIES = ['All', 'Care Guides', 'DIY', 'Plant Doctor', 'Styling', 'Pet Friendly'];

export default function BlogScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedPost, setExpandedPost] = useState(null);

  const filtered = activeCategory === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === activeCategory);
  const featured = BLOG_POSTS.filter(p => p.featured)[0];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 0) }]}>
        <Text style={styles.headerTitle}>Plant Care Guides</Text>
        <Text style={styles.headerSub}>Expert advice for every plant parent</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured Post */}
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => setExpandedPost(expandedPost === featured.id ? null : featured.id)}
          activeOpacity={0.9}
        >
          <View style={[styles.featuredImg, { backgroundColor: featured.gradient[0] }]}>
            <Text style={{ fontSize: 56 }}>{featured.emoji}</Text>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>✨ FEATURED</Text>
            </View>
          </View>
          <View style={styles.featuredBody}>
            <Text style={styles.featuredCategory}>{featured.category}</Text>
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.featuredExcerpt} numberOfLines={expandedPost === featured.id ? undefined : 2}>
              {featured.excerpt}
            </Text>
            {expandedPost === featured.id && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedText}>
                  {featured.excerpt} This comprehensive guide covers everything from choosing the right spot to adjusting your care routine as the seasons change. Our plant experts have compiled years of experience into practical, actionable advice that works for both beginner and experienced plant parents.{'\n\n'}Whether you're dealing with a struggling specimen or looking to help your plants truly thrive, the principles outlined here will transform your approach to plant care.
                </Text>
              </View>
            )}
            <View style={styles.featuredMeta}>
              <Text style={styles.metaDate}>{featured.date}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaRead}>{featured.readTime}</Text>
              <Text style={styles.readMoreText}>{expandedPost === featured.id ? 'Read Less ↑' : 'Read More →'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
          {BLOG_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        <View style={styles.postsSection}>
          {filtered.map(post => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              activeOpacity={0.88}
            >
              <View style={[styles.postImg, { backgroundColor: post.gradient[0] }]}>
                <Text style={{ fontSize: 32 }}>{post.emoji}</Text>
              </View>
              <View style={styles.postBody}>
                <Text style={styles.postCategory}>{post.category}</Text>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postExcerpt} numberOfLines={expandedPost === post.id ? undefined : 2}>
                  {post.excerpt}
                </Text>
                {expandedPost === post.id && (
                  <Text style={styles.expandedText}>
                    {post.excerpt} Our expert gardeners have tested these techniques across hundreds of plants to bring you the most reliable advice. Apply these principles consistently and you'll see remarkable results within just a few weeks.
                  </Text>
                )}
                <View style={styles.postMeta}>
                  <Text style={styles.metaDate}>{post.date}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaRead}>{post.readTime}</Text>
                  <Text style={styles.readMoreText}>{expandedPost === post.id ? 'Read Less ↑' : 'Read More →'}</Text>
                </View>
                <View style={styles.postTags}>
                  {post.tags.map(tag => (
                    <View key={tag} style={styles.postTag}>
                      <Text style={styles.postTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Plant Doctor CTA */}
        <TouchableOpacity
          style={styles.doctorCTA}
          onPress={() => navigation.navigate('AI')}
        >
          <Text style={{ fontSize: 36, marginBottom: 8 }}>🤖</Text>
          <Text style={styles.doctorTitle}>Got a Plant Problem?</Text>
          <Text style={styles.doctorSub}>Ask our AI Plant Doctor for instant, personalised advice.</Text>
          <View style={styles.doctorBtn}>
            <Text style={styles.doctorBtnText}>Ask AI Now →</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.forest, paddingHorizontal: 20, paddingBottom: 20,
  },
  headerTitle: { color: colors.white, fontSize: 24, fontWeight: '800', paddingTop: 12 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },

  featuredCard: {
    backgroundColor: colors.white, margin: 16, borderRadius: 20,
    overflow: 'hidden', ...shadows.md,
  },
  featuredImg: {
    height: 160, justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  featuredBadge: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: colors.amber, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  featuredBadgeText: { color: colors.white, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  featuredBody: { padding: 18 },
  featuredCategory: { fontSize: 10, color: colors.medium, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  featuredTitle: { fontSize: 18, fontWeight: '800', color: colors.text, lineHeight: 24, marginBottom: 8 },
  featuredExcerpt: { fontSize: 13, color: colors.textMed, lineHeight: 20, marginBottom: 8 },
  expandedContent: { marginTop: 4 },
  expandedText: { fontSize: 13, color: colors.textMed, lineHeight: 21, marginBottom: 8 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaDate: { fontSize: 11, color: colors.textLight },
  metaDot: { fontSize: 11, color: colors.textLight },
  metaRead: { fontSize: 11, color: colors.textLight },
  readMoreText: { flex: 1, textAlign: 'right', fontSize: 12, color: colors.medium, fontWeight: '600' },

  catRow: { paddingHorizontal: 12, marginBottom: 8 },
  catChip: {
    backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    marginHorizontal: 4, borderWidth: 1, borderColor: colors.border,
  },
  catChipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  catChipText: { fontSize: 12, color: colors.textMed, fontWeight: '600' },
  catChipTextActive: { color: colors.white },

  postsSection: { paddingHorizontal: 16 },
  postCard: {
    backgroundColor: colors.white, borderRadius: 14, marginBottom: 10,
    flexDirection: 'row', overflow: 'hidden', ...shadows.sm,
  },
  postImg: { width: 80, justifyContent: 'center', alignItems: 'center' },
  postBody: { flex: 1, padding: 14 },
  postCategory: { fontSize: 9, color: colors.medium, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  postTitle: { fontSize: 13, fontWeight: '700', color: colors.text, lineHeight: 18, marginBottom: 4 },
  postExcerpt: { fontSize: 12, color: colors.textLight, lineHeight: 16, marginBottom: 6 },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  postTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  postTag: { backgroundColor: colors.mint, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  postTagText: { fontSize: 9, color: colors.forest, fontWeight: '600' },

  doctorCTA: {
    backgroundColor: colors.aiPurple, margin: 16, borderRadius: 20,
    padding: 24, alignItems: 'center', ...shadows.md,
  },
  doctorTitle: { color: colors.white, fontSize: 20, fontWeight: '800', marginBottom: 8 },
  doctorSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, textAlign: 'center', marginBottom: 16 },
  doctorBtn: {
    backgroundColor: colors.white, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  doctorBtnText: { color: colors.aiPurple, fontWeight: '700', fontSize: 14 },
});
