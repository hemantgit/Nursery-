import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';

const ORDERS = [
  { id: '#LB-1042', date: 'May 5, 2026', items: 3, total: '$71.00', status: 'Delivered', statusColor: colors.success },
  { id: '#LB-1039', date: 'Apr 28, 2026', items: 1, total: '$25.00', status: 'Delivered', statusColor: colors.success },
  { id: '#LB-1035', date: 'Apr 15, 2026', items: 2, total: '$45.00', status: 'Delivered', statusColor: colors.success },
];

const MY_PLANTS = [
  { name: 'Monstera Deliciosa', nextWater: 'Tomorrow', emoji: '🌿', health: 'Thriving' },
  { name: 'Snake Plant', nextWater: 'In 2 weeks', emoji: '🌱', health: 'Healthy' },
  { name: 'Fiddle Leaf Fig', nextWater: 'In 3 days', emoji: '🍃', health: 'Needs attention' },
];

function SettingRow({ label, desc, icon, value, onToggle, type = 'switch' }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View>
          <Text style={styles.settingLabel}>{label}</Text>
          {desc && <Text style={styles.settingDesc}>{desc}</Text>}
        </View>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.light }}
          thumbColor={value ? colors.forest : colors.white}
        />
      ) : (
        <Text style={styles.settingArrow}>›</Text>
      )}
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cart, wishlist } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [careReminders, setCareReminders] = useState(true);

  const healthColor = (health) => {
    if (health === 'Thriving') return colors.success;
    if (health === 'Healthy') return colors.medium;
    return colors.amber;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 0) }]}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 40 }}>👤</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Text style={{ fontSize: 12 }}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Alex Green</Text>
          <Text style={styles.userEmail}>alex.green@email.com</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>⭐ Gold Member</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{ORDERS.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{wishlist.length || MY_PLANTS.length}</Text>
              <Text style={styles.statLabel}>Plants</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{cart.length}</Text>
              <Text style={styles.statLabel}>In Cart</Text>
            </View>
          </View>
        </View>

        {/* My Plant Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🪴 My Plant Collection</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Manage →</Text>
            </TouchableOpacity>
          </View>
          {MY_PLANTS.map(plant => (
            <View key={plant.name} style={styles.plantRow}>
              <View style={styles.plantRowLeft}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>{plant.emoji}</Text>
                <View>
                  <Text style={styles.plantRowName}>{plant.name}</Text>
                  <Text style={styles.plantRowWater}>💧 Next water: {plant.nextWater}</Text>
                </View>
              </View>
              <View style={[styles.healthBadge, { backgroundColor: `${healthColor(plant.health)}20` }]}>
                <Text style={[styles.healthText, { color: healthColor(plant.health) }]}>{plant.health}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Recent Orders</Text>
          {ORDERS.map(order => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderMeta}>{order.date} · {order.items} item{order.items !== 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderTotal}>{order.total}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${order.statusColor}20` }]}>
                  <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Preferences</Text>
          <View style={styles.settingsCard}>
            <SettingRow
              icon="🔔"
              label="Push Notifications"
              desc="Order updates & new arrivals"
              value={notifications}
              onToggle={setNotifications}
            />
            <View style={styles.settingDivider} />
            <SettingRow
              icon="📅"
              label="Care Reminders"
              desc="Watering & fertilising alerts"
              value={careReminders}
              onToggle={setCareReminders}
            />
            <View style={styles.settingDivider} />
            <SettingRow
              icon="📧"
              label="Newsletter"
              desc="Weekly tips & exclusive deals"
              value={newsletter}
              onToggle={setNewsletter}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🆘 Support</Text>
          <View style={styles.settingsCard}>
            {[
              { icon: '❓', label: 'Help Centre' },
              { icon: '💬', label: 'Contact Us' },
              { icon: '↩️', label: 'Return Policy' },
              { icon: '🔒', label: 'Privacy Policy' },
              { icon: '⭐', label: 'Rate the App' },
            ].map((item, idx, arr) => (
              <View key={item.label}>
                <SettingRow icon={item.icon} label={item.label} type="link" />
                {idx < arr.length - 1 && <View style={styles.settingDivider} />}
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>LeafBloom v2.0.0 · Made with 🌿</Text>

        <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.forest, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12,
  },
  headerTitle: { color: colors.white, fontSize: 24, fontWeight: '800' },

  profileCard: {
    backgroundColor: colors.white, margin: 16, borderRadius: 20,
    padding: 24, alignItems: 'center', ...shadows.md,
  },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 80, height: 80, backgroundColor: colors.mint,
    borderRadius: 40, justifyContent: 'center', alignItems: 'center',
  },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: colors.white, borderRadius: 10, width: 24, height: 24,
    justifyContent: 'center', alignItems: 'center', ...shadows.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  userName: { fontSize: 20, fontWeight: '800', color: colors.text },
  userEmail: { fontSize: 13, color: colors.textLight, marginTop: 2, marginBottom: 8 },
  memberBadge: {
    backgroundColor: '#FFF9E0', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 16,
    borderWidth: 1, borderColor: '#F1C40F30',
  },
  memberBadgeText: { fontSize: 12, color: '#B8860B', fontWeight: '700' },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.forest },
  statLabel: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  statDiv: { width: 1, backgroundColor: colors.border },

  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10, marginTop: 4 },
  seeAll: { fontSize: 13, color: colors.medium, fontWeight: '600' },

  plantRow: {
    backgroundColor: colors.white, borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 6, ...shadows.sm,
  },
  plantRowLeft: { flexDirection: 'row', alignItems: 'center' },
  plantRowName: { fontSize: 13, fontWeight: '700', color: colors.text },
  plantRowWater: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  healthBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  healthText: { fontSize: 11, fontWeight: '700' },

  orderCard: {
    backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 6,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...shadows.sm,
  },
  orderLeft: {},
  orderId: { fontSize: 14, fontWeight: '700', color: colors.text },
  orderMeta: { fontSize: 11, color: colors.textLight, marginTop: 2 },
  orderRight: { alignItems: 'flex-end' },
  orderTotal: { fontSize: 15, fontWeight: '700', color: colors.forest, marginBottom: 4 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },

  settingsCard: {
    backgroundColor: colors.white, borderRadius: 14, overflow: 'hidden', ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { fontSize: 18, width: 28, textAlign: 'center' },
  settingLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  settingDesc: { fontSize: 11, color: colors.textLight, marginTop: 1 },
  settingArrow: { fontSize: 22, color: colors.textLight },
  settingDivider: { height: 1, backgroundColor: colors.divider, marginHorizontal: 16 },

  signOutBtn: {
    marginHorizontal: 16, marginTop: 8, marginBottom: 4,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.coral,
    paddingVertical: 14, alignItems: 'center',
  },
  signOutText: { color: colors.coral, fontSize: 15, fontWeight: '700' },
  versionText: { textAlign: 'center', fontSize: 11, color: colors.textMuted, marginTop: 8 },
});
