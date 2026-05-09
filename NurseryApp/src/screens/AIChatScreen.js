import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';

const QUICK_QUESTIONS = [
  'Why are my leaves turning yellow?',
  'How often should I water?',
  'My plant has white spots',
  'Best plants for low light?',
  'How do I repot my plant?',
  'Why is my plant drooping?',
];

const AI_KNOWLEDGE = [
  {
    keywords: ['yellow', 'yellowing', 'yellow leaves'],
    response: `**Yellow leaves** are one of the most common plant issues. Here are the likely causes:\n\n🔸 **Overwatering** (most common) — Check if soil is consistently wet. Let it dry out more between waterings.\n\n🔸 **Underwatering** — Leaves yellow and crisp? Your plant is thirsty.\n\n🔸 **Too little light** — Move to a brighter spot with indirect sun.\n\n🔸 **Natural ageing** — Lower leaves yellowing is normal — the plant is shedding old leaves.\n\n🔸 **Nutrient deficiency** — If many leaves are yellowing, try a balanced liquid fertiliser.\n\n**Quick fix:** Check soil moisture first. If soggy, reduce watering and ensure good drainage. If bone dry, water thoroughly.`,
  },
  {
    keywords: ['water', 'watering', 'how often', 'overwater'],
    response: `**Watering guide for healthy plants:**\n\n💧 **The Golden Rule:** Check before you water. Stick your finger 2 inches into the soil — if it feels moist, wait.\n\n📅 **General schedules:**\n• Succulents & cacti: Every 2–4 weeks\n• Tropical houseplants: Every 7–10 days\n• Herbs & fast growers: Every 2–3 days\n• Peace Lily, Pothos: When top inch is dry\n\n⚠️ **Overwatering signs:** Yellow leaves, mushy stems, mouldy soil, root rot smell.\n\n⚠️ **Underwatering signs:** Crispy leaf edges, wilting, very dry soil pulling from pot edges.\n\n🏆 **Pro tip:** Most plants prefer to be slightly underwatered than overwatered. When in doubt, wait!`,
  },
  {
    keywords: ['white spots', 'white', 'mealybugs', 'fungus', 'powdery'],
    response: `**White spots** can mean a few different things:\n\n🪲 **Mealybugs** (fluffy white cotton-like clusters)\n→ Treatment: Dab with 70% isopropyl alcohol on a cotton swab. Repeat weekly for 3 weeks.\n\n🍄 **Powdery Mildew** (white dusty coating on leaves)\n→ Treatment: Improve air circulation, reduce humidity. Spray with diluted neem oil.\n\n💧 **Mineral deposits from hard water** (chalky spots)\n→ Treatment: Wipe with diluted white vinegar. Use filtered water going forward.\n\n🕷 **Spider mite webbing** (fine white webbing, especially under leaves)\n→ Treatment: Rinse plant thoroughly, apply neem oil spray weekly.\n\n**First step:** Inspect under leaves with a magnifying glass to identify the culprit!`,
  },
  {
    keywords: ['low light', 'dark', 'shade', 'no window'],
    response: `**Best plants for low light conditions:**\n\n🏆 **Nearly indestructible low-light plants:**\n• 🌱 Snake Plant — survives almost total darkness\n• 💚 Pothos — thrives in shade, fast growing\n• ✨ ZZ Plant — tolerates neglect beautifully\n• 🌸 Peace Lily — the best flowering low-light plant\n\n👍 **Good options:**\n• Cast Iron Plant, Chinese Evergreen\n• Dracaena, Heartleaf Philodendron\n• Spider Plant, Ferns (need humidity)\n\n⚠️ **Important:** No plant survives in complete darkness. Even "low light" means some natural light — at least a few feet from a window. Consider a grow light for windowless rooms.\n\n💡 **Tip:** Rotate plants so all sides get light exposure!`,
  },
  {
    keywords: ['repot', 'repotting', 'new pot', 'pot bound', 'root bound'],
    response: `**How to repot your plant successfully:**\n\n📅 **When to repot:**\n• Roots growing out of drainage holes\n• Plant looks too big for its pot\n• Soil dries out unusually fast\n• It's been 1–2 years in the same pot\n\n🪴 **Step-by-step:**\n1. Choose a pot 2 inches larger in diameter\n2. Water your plant 24 hours before repotting\n3. Gently remove plant and shake off old soil\n4. Inspect roots — trim any black/mushy ones\n5. Place fresh potting mix in new pot\n6. Position plant and fill around roots\n7. Water thoroughly and place in indirect light\n\n⏰ **Best time:** Spring or early summer (growing season)\n\n⚠️ **Avoid:** Repotting in winter, or going up more than 2 pot sizes at once.`,
  },
  {
    keywords: ['drooping', 'wilting', 'droopy', 'limp', 'sagging'],
    response: `**Plant drooping — here's what's happening:**\n\n💧 **Underwatering** (most likely cause)\n→ Soil is dry and crispy? Water thoroughly and it should perk up within hours.\n\n😵 **Overwatering / root rot**\n→ Soil is wet and smells bad? Reduce watering immediately. Check roots for rot — trim black/mushy roots and repot in fresh dry soil.\n\n☀️ **Too much direct sun**\n→ Wilting in afternoon despite good watering? Provide shade from harsh direct sun.\n\n🌡 **Temperature shock**\n→ Cold draughts, air conditioning, or heating vents can cause wilting. Move away from these.\n\n🪴 **Root bound**\n→ If pot is packed with roots, the plant can't absorb water properly. Time to repot!\n\n**Quick test:** If the soil is moist but plant still wilts, suspect root rot.`,
  },
  {
    keywords: ['fertilise', 'fertilize', 'feed', 'nutrients', 'fertilizer'],
    response: `**Plant feeding guide:**\n\n🌱 **When to fertilise:**\n• Spring and summer (active growing season)\n• Monthly during growing season\n• Stop or reduce in autumn/winter\n\n📦 **Types of fertiliser:**\n• **Liquid fertiliser** — Fast acting, apply with water monthly\n• **Slow-release granules** — Convenient, lasts 3–6 months\n• **Organic (worm castings, compost)** — Gentler, soil-friendly\n\n🌿 **NPK ratios explained:**\n• N (Nitrogen) → Leaf growth\n• P (Phosphorus) → Root and flower development\n• K (Potassium) → Overall plant health\n\n⚠️ **Common mistakes:**\n• Over-fertilising causes salt burn (brown leaf tips)\n• Always water before applying fertiliser\n• Never fertilise a stressed or sick plant\n\n💡 Use half the recommended dose to start safely.`,
  },
  {
    keywords: ['pest', 'bugs', 'insects', 'gnats', 'flies', 'spider mite'],
    response: `**Common houseplant pests and solutions:**\n\n🦟 **Fungus Gnats** (tiny flies around soil)\n→ Let soil dry completely between waterings. Apply hydrogen peroxide solution (1:4 with water).\n\n🕷 **Spider Mites** (fine webbing, speckled leaves)\n→ Rinse plant, increase humidity, apply neem oil spray weekly.\n\n🪲 **Scale** (brown bumps on stems)\n→ Scrape off with old toothbrush, treat with horticultural oil.\n\n🐛 **Mealybugs** (white fluffy clusters)\n→ Isolate plant immediately. Treat with alcohol-soaked cotton buds.\n\n🌿 **Prevention tips:**\n• Inspect new plants before bringing them home\n• Quarantine new plants for 2 weeks\n• Don't overwater (prevents gnats)\n• Good air circulation discourages most pests\n\n🏆 **Neem oil** is effective against most pests — a plant owner's best friend!`,
  },
  {
    keywords: ['propagate', 'propagation', 'cuttings', 'grow more'],
    response: `**How to propagate your plants for free:**\n\n✂️ **Water propagation (easiest):**\n1. Take a healthy stem cutting just below a node\n2. Remove lower leaves, leaving 2–3 at the top\n3. Place in clean water in bright indirect light\n4. Change water every 3–5 days\n5. Plant when roots are 2–3 cm long\n\n🌱 **Works great for:** Pothos, Philodendron, Begonia, Coleus\n\n🪴 **Soil propagation:**\n1. Take cuttings and dip in rooting hormone\n2. Plant in moist seed-raising mix\n3. Cover with plastic bag to maintain humidity\n4. Keep warm and bright — roots form in 2–4 weeks\n\n🌿 **Division (for multi-stemmed plants):**\nGently separate the root ball and pot individually.\n\n💡 **Best time:** Spring and summer when growth is most active.`,
  },
  {
    keywords: ['recommend', 'suggestion', 'which plant', 'best plant', 'choose'],
    response: `**Let me help you find the perfect plant!** 🌿\n\n**For beginners:**\n• 🌱 Snake Plant — literally thrives on neglect\n• 💚 Pothos — fast growing, forgiving\n• 🪴 Aloe Vera — useful & low maintenance\n\n**For low light spaces:**\n• ✨ ZZ Plant, 🌸 Peace Lily, 💚 Pothos\n\n**For pet owners:**\n• 🌵 Echeveria (succulents), 🌸 Orchid\n• 🍁 Japanese Maple, 🌿 Basil\n\n**For dramatic impact:**\n• 🌿 Monstera Deliciosa\n• 🦜 Bird of Paradise\n• 🍃 Fiddle Leaf Fig\n\n**For tiny spaces:**\n• 🌵 Succulents/Echeveria\n• 🎨 Calathea (stunning, compact)\n• 🌸 Orchid\n\n💡 **Try our Plant Finder Quiz** for a personalised recommendation based on your exact situation!`,
  },
];

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot, delay) => Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(600),
      ])
    ).start();
    anim(dot1, 0);
    anim(dot2, 200);
    anim(dot3, 400);
  }, []);

  return (
    <View style={typingStyles.container}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View key={i} style={[typingStyles.dot, { opacity: dot }]} />
      ))}
    </View>
  );
}

const typingStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 4, padding: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.textLight },
});

function getAIResponse(text) {
  const lower = text.toLowerCase();
  for (const entry of AI_KNOWLEDGE) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.response;
    }
  }
  return `Great question about "${text}"! 🌿\n\nAs a general plant care principle, most issues come down to:\n\n💧 **Water** — too much or too little is the #1 cause of plant problems\n☀️ **Light** — ensure your plant matches its light requirements\n🌡 **Environment** — temperature, humidity and drafts all matter\n\nCould you tell me more about your plant's specific symptoms? For example:\n• What does the plant look like right now?\n• What type of plant is it?\n• How often do you currently water?\n\nI can give much more targeted advice with a few more details! 🤖`;
}

function renderMarkdown(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <Text key={i} style={styles.mdBold}>{line.slice(2, -2)}{'\n'}</Text>;
    }
    const boldified = line.replace(/\*\*(.*?)\*\*/g, (_, match) => `〔${match}〕`);
    if (boldified.includes('〔')) {
      const parts = boldified.split(/(〔[^〕]+〕)/g);
      return (
        <Text key={i} style={styles.mdText}>
          {parts.map((p, j) =>
            p.startsWith('〔') && p.endsWith('〕')
              ? <Text key={j} style={styles.mdBoldInline}>{p.slice(1, -1)}</Text>
              : p
          )}
          {'\n'}
        </Text>
      );
    }
    return <Text key={i} style={styles.mdText}>{line}{'\n'}</Text>;
  });
}

export default function AIChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([
    {
      id: '0',
      role: 'ai',
      text: `Hi there! 👋 I'm **LeafBloom AI**, your personal plant expert.\n\nI can help you with:\n• 🌿 Plant care & watering advice\n• 🔍 Diagnosing plant problems\n• 🪲 Pest identification & treatment\n• 🌱 Plant recommendations\n• ✂️ Propagation techniques\n\nWhat plant question can I answer today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput('');

    const userMsg = { id: Date.now().toString(), role: 'user', text: trimmed, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = getAIResponse(trimmed);
    const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: response, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleQuick = (q) => sendMessage(q);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 4) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 18, color: colors.white }}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.aiAvatar}>
            <Text style={{ fontSize: 18 }}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerName}>LeafBloom AI</Text>
            <View style={styles.onlineDot}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.onlineText}>Online · Plant Expert</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[styles.messageRow, msg.role === 'user' ? styles.userRow : styles.aiRow]}
          >
            {msg.role === 'ai' && (
              <View style={styles.aiAvatarSmall}>
                <Text style={{ fontSize: 14 }}>🤖</Text>
              </View>
            )}
            <View style={[
              styles.bubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}>
              {msg.role === 'ai'
                ? <View>{renderMarkdown(msg.text)}</View>
                : <Text style={styles.userText}>{msg.text}</Text>
              }
              <Text style={[styles.timestamp, msg.role === 'user' && styles.timestampUser]}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageRow, styles.aiRow]}>
            <View style={styles.aiAvatarSmall}>
              <Text style={{ fontSize: 14 }}>🤖</Text>
            </View>
            <View style={[styles.bubble, styles.aiBubble]}>
              <TypingIndicator />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick questions */}
      <View style={styles.quickSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
          {QUICK_QUESTIONS.map(q => (
            <TouchableOpacity key={q} style={styles.quickBtn} onPress={() => handleQuick(q)}>
              <Text style={styles.quickBtnText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 12 : 8) }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your plants..."
          placeholderTextColor={colors.textLight}
          multiline
          maxLength={300}
          onSubmitEditing={() => sendMessage()}
          returnKeyType="send"
          blurOnSubmit
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || isTyping) && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || isTyping}
        >
          <Text style={{ fontSize: 18 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.forest, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  aiAvatar: {
    width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 19, justifyContent: 'center', alignItems: 'center',
  },
  headerName: { color: colors.white, fontSize: 15, fontWeight: '700' },
  onlineDot: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4AE54A' },
  onlineText: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },

  messageList: { flex: 1 },
  messageListContent: { padding: 16, gap: 12 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  aiAvatarSmall: {
    width: 30, height: 30, backgroundColor: colors.mint,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '80%', borderRadius: 18, padding: 12,
  },
  userBubble: {
    backgroundColor: colors.forest, borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.white, borderBottomLeftRadius: 4, ...shadows.sm,
  },
  userText: { color: colors.white, fontSize: 14, lineHeight: 20 },
  mdText: { fontSize: 13, color: colors.textMed, lineHeight: 19 },
  mdBold: { fontSize: 14, fontWeight: '700', color: colors.text },
  mdBoldInline: { fontWeight: '700', color: colors.text },
  timestamp: { fontSize: 10, color: 'rgba(0,0,0,0.35)', marginTop: 4, alignSelf: 'flex-end' },
  timestampUser: { color: 'rgba(255,255,255,0.5)' },

  quickSection: {
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
    paddingVertical: 8,
  },
  quickScroll: { paddingHorizontal: 12 },
  quickBtn: {
    backgroundColor: colors.mint, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7, marginRight: 6,
    borderWidth: 1, borderColor: colors.light,
  },
  quickBtnText: { fontSize: 12, color: colors.forest, fontWeight: '600' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: colors.surface, paddingHorizontal: 12, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: colors.text, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, backgroundColor: colors.forest,
    borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.border },
});
