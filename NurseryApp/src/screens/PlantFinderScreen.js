import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '../theme/colors';
import { PLANTS } from '../data/plants';
import { useApp } from '../context/AppContext';

const QUESTIONS = [
  {
    id: 'experience',
    question: 'What\'s your plant experience level?',
    emoji: '🌱',
    options: [
      { id: 'beginner', label: 'Total Beginner', desc: 'I\'ve killed every plant I\'ve owned', emoji: '😅' },
      { id: 'some', label: 'Some Experience', desc: 'A few plants, some survived!', emoji: '🙂' },
      { id: 'confident', label: 'Confident', desc: 'I know my way around a potting mix', emoji: '😊' },
      { id: 'expert', label: 'Plant Parent', desc: 'My home is basically a jungle', emoji: '🌿' },
    ],
  },
  {
    id: 'light',
    question: 'How much natural light does your space get?',
    emoji: '☀️',
    options: [
      { id: 'low', label: 'Low Light', desc: 'Far from windows, mostly artificial light', emoji: '🌑' },
      { id: 'medium', label: 'Medium Light', desc: 'Bright indirect light most of the day', emoji: '🌤' },
      { id: 'bright', label: 'Bright & Sunny', desc: 'South or west-facing windows', emoji: '☀️' },
      { id: 'any', label: 'Mix of Both', desc: 'Some bright, some dim areas', emoji: '🌓' },
    ],
  },
  {
    id: 'watering',
    question: 'How often do you want to water?',
    emoji: '💧',
    options: [
      { id: 'rarely', label: 'As Rarely as Possible', desc: 'Monthly or less is ideal for me', emoji: '🏜' },
      { id: 'weekly', label: 'Once a Week', desc: 'A regular weekend watering routine', emoji: '📅' },
      { id: 'often', label: 'Daily is Fine', desc: 'I love tending to my plants', emoji: '💚' },
      { id: 'forget', label: 'I Forget Sometimes', desc: 'Forgiving plants please!', emoji: '🤔' },
    ],
  },
  {
    id: 'pets',
    question: 'Do you have pets or young children?',
    emoji: '🐾',
    options: [
      { id: 'yes_cats', label: 'Cats', desc: 'Need pet-safe plants only', emoji: '🐱' },
      { id: 'yes_dogs', label: 'Dogs', desc: 'Need pet-safe plants only', emoji: '🐶' },
      { id: 'yes_both', label: 'Both / Kids', desc: 'Safety is top priority', emoji: '👨‍👩‍👧' },
      { id: 'no', label: 'No Pets / Kids', desc: 'All plants are on the table!', emoji: '🌿' },
    ],
  },
  {
    id: 'vibe',
    question: 'What\'s your plant vibe?',
    emoji: '🎨',
    options: [
      { id: 'tropical', label: 'Jungle Vibes', desc: 'Big, dramatic tropical leaves', emoji: '🌴' },
      { id: 'minimal', label: 'Clean & Minimal', desc: 'Sculptural, architectural plants', emoji: '⬜' },
      { id: 'colorful', label: 'Colour & Flowers', desc: 'Blooms and vibrant foliage', emoji: '🌸' },
      { id: 'practical', label: 'Useful Herbs', desc: 'Plants I can cook or heal with', emoji: '🫚' },
    ],
  },
];

function matchPlants(answers) {
  return PLANTS.filter(p => {
    const petSafe = !['yes_cats', 'yes_dogs', 'yes_both'].includes(answers.pets) || p.petFriendly;

    const careLevelOk = (() => {
      if (answers.experience === 'beginner' || answers.watering === 'rarely' || answers.watering === 'forget') {
        return ['Very Easy', 'Easy'].includes(p.care);
      }
      if (answers.experience === 'some') return p.care !== 'Advanced';
      return true;
    })();

    const lightOk = (() => {
      if (answers.light === 'low') return ['Any Light', 'Low to Medium', 'Low to Bright'].some(l => p.light.includes(l.split(' ')[0])) || p.light.includes('Low') || p.light.includes('Any');
      if (answers.light === 'bright') return true;
      return true;
    })();

    const vibeOk = (() => {
      if (answers.vibe === 'tropical') return ['tropical', 'indoor'].includes(p.category);
      if (answers.vibe === 'colorful') return ['flowering', 'outdoor'].includes(p.category);
      if (answers.vibe === 'practical') return ['herbs', 'succulents'].includes(p.category);
      if (answers.vibe === 'minimal') return ['succulents', 'indoor'].includes(p.category);
      return true;
    })();

    return petSafe && careLevelOk && lightOk && vibeOk;
  }).slice(0, 4);
}

export default function PlantFinderScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { addToCart } = useApp();
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = results
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);

  const progress = step === 0 ? 0 : step / QUESTIONS.length;

  const handleAnswer = (questionId, optionId) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    }
    if (step === QUESTIONS.length - 1) {
      const matched = matchPlants({ ...newAnswers, [questionId]: optionId });
      setResults(matched.length > 0 ? matched : PLANTS.slice(0, 4));
      setStep(QUESTIONS.length + 1);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setResults([]); };

  const currentQ = step > 0 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 8 : 4) }]}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Finder</Text>
        <View style={{ width: 60 }} />
      </View>

      {step > 0 && step <= QUESTIONS.length && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        {step === 0 && (
          <View style={styles.introSection}>
            <Text style={styles.introEmoji}>🌿</Text>
            <Text style={styles.introTitle}>Find Your Perfect Plant</Text>
            <Text style={styles.introText}>
              Answer 5 quick questions and our AI will recommend the best plants for your lifestyle, space, and experience level.
            </Text>
            <View style={styles.introFeatures}>
              {[['⚡', '2 minutes'], ['🎯', 'Personalised'], ['🌿', '20+ plants']].map(([icon, label]) => (
                <View key={label} style={styles.introFeature}>
                  <Text style={{ fontSize: 20 }}>{icon}</Text>
                  <Text style={styles.introFeatureText}>{label}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.startBtn} onPress={() => setStep(1)}>
              <Text style={styles.startBtnText}>Start Quiz →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Questions */}
        {currentQ && (
          <View style={styles.questionSection}>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Question {step} of {QUESTIONS.length}</Text>
            </View>
            <Text style={styles.questionEmoji}>{currentQ.emoji}</Text>
            <Text style={styles.questionText}>{currentQ.question}</Text>
            <View style={styles.optionsGrid}>
              {currentQ.options.map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optionCard, answers[currentQ.id] === opt.id && styles.optionCardSelected]}
                  onPress={() => handleAnswer(currentQ.id, opt.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.optionLabel, answers[currentQ.id] === opt.id && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.optionDesc} numberOfLines={2}>{opt.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        {step === QUESTIONS.length + 1 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsBanner}>
              <Text style={styles.resultsEmoji}>🎉</Text>
              <Text style={styles.resultsTitle}>Your Perfect Plants!</Text>
              <Text style={styles.resultsSub}>Based on your answers, we think you'll love these:</Text>
            </View>

            {results.map(plant => (
              <View key={plant.id} style={styles.resultCard}>
                <View style={[styles.resultCardImg, { backgroundColor: plant.bgColor }]}>
                  <Text style={{ fontSize: 48 }}>{plant.emoji}</Text>
                </View>
                <View style={styles.resultCardBody}>
                  <Text style={styles.resultCare}>{plant.care} care</Text>
                  <Text style={styles.resultName}>{plant.name}</Text>
                  <Text style={styles.resultDesc} numberOfLines={2}>{plant.shortDesc}</Text>
                  <View style={styles.resultMeta}>
                    <Text style={styles.resultLight}>{plant.lightIcon} {plant.light}</Text>
                    <Text style={styles.resultWater}>{plant.waterIcon} {plant.water}</Text>
                  </View>
                  <View style={styles.resultBadges}>
                    {plant.petFriendly && <View style={styles.petBadge}><Text style={styles.petBadgeText}>🐾 Pet Safe</Text></View>}
                    {plant.airPurifying && <View style={styles.airBadge}><Text style={styles.airBadgeText}>🌬 Air Purifying</Text></View>}
                  </View>
                  <View style={styles.resultActions}>
                    <Text style={styles.resultPrice}>${plant.price}</Text>
                    <View style={styles.resultBtns}>
                      <TouchableOpacity
                        style={styles.viewBtn}
                        onPress={() => navigation.navigate('PlantDetail', { plantId: plant.id })}
                      >
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(plant)}>
                        <Text style={styles.cartBtnText}>Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.retakeBtn} onPress={reset}>
              <Text style={styles.retakeBtnText}>↺ Retake Quiz</Text>
            </TouchableOpacity>

            <View style={{ height: Platform.OS === 'web' ? 40 : 100 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.forest, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: { paddingVertical: 6 },
  backBtnText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  headerTitle: { color: colors.white, fontSize: 17, fontWeight: '700' },
  progressBar: { height: 4, backgroundColor: colors.border },
  progressFill: { height: 4, backgroundColor: colors.light },

  scrollContent: { flexGrow: 1 },

  introSection: { padding: 32, alignItems: 'center' },
  introEmoji: { fontSize: 80, marginBottom: 20 },
  introTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12, textAlign: 'center' },
  introText: { fontSize: 15, color: colors.textMed, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  introFeatures: { flexDirection: 'row', gap: 24, marginBottom: 36 },
  introFeature: { alignItems: 'center', gap: 4 },
  introFeatureText: { fontSize: 12, color: colors.textMed, fontWeight: '600' },
  startBtn: {
    backgroundColor: colors.forest, borderRadius: 16,
    paddingHorizontal: 48, paddingVertical: 16,
    ...shadows.md,
  },
  startBtnText: { color: colors.white, fontSize: 17, fontWeight: '700' },

  questionSection: { padding: 24 },
  stepIndicator: {
    backgroundColor: colors.mint, alignSelf: 'flex-start',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16,
  },
  stepText: { fontSize: 12, color: colors.forest, fontWeight: '700' },
  questionEmoji: { fontSize: 48, marginBottom: 12 },
  questionText: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30, marginBottom: 24 },
  optionsGrid: { gap: 12 },
  optionCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: colors.border, ...shadows.sm,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  optionCardSelected: { borderColor: colors.forest, backgroundColor: colors.mint },
  optionEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
  optionLabel: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  optionLabelSelected: { color: colors.forest },
  optionDesc: { fontSize: 12, color: colors.textLight, flex: 2 },

  resultsSection: { padding: 16 },
  resultsBanner: {
    backgroundColor: colors.forest, borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 16, ...shadows.md,
  },
  resultsEmoji: { fontSize: 48, marginBottom: 8 },
  resultsTitle: { color: colors.white, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  resultsSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center' },

  resultCard: {
    backgroundColor: colors.white, borderRadius: 16, marginBottom: 12,
    flexDirection: 'row', overflow: 'hidden', ...shadows.sm,
  },
  resultCardImg: { width: 100, justifyContent: 'center', alignItems: 'center' },
  resultCardBody: { flex: 1, padding: 14 },
  resultCare: { fontSize: 10, color: colors.medium, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  resultName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  resultDesc: { fontSize: 12, color: colors.textLight, lineHeight: 17, marginBottom: 6 },
  resultMeta: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  resultLight: { fontSize: 11, color: colors.textMed },
  resultWater: { fontSize: 11, color: colors.textMed },
  resultBadges: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  petBadge: { backgroundColor: '#FFF3E0', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  petBadgeText: { fontSize: 10, color: '#E65100', fontWeight: '600' },
  airBadge: { backgroundColor: colors.mint, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  airBadgeText: { fontSize: 10, color: colors.forest, fontWeight: '600' },
  resultActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultPrice: { fontSize: 18, fontWeight: '800', color: colors.forest },
  resultBtns: { flexDirection: 'row', gap: 6 },
  viewBtn: {
    backgroundColor: colors.surfaceAlt, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  viewBtnText: { fontSize: 12, color: colors.text, fontWeight: '600' },
  cartBtn: {
    backgroundColor: colors.forest, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  cartBtnText: { fontSize: 12, color: colors.white, fontWeight: '600' },

  retakeBtn: {
    backgroundColor: colors.surfaceAlt, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  retakeBtnText: { color: colors.textMed, fontWeight: '600', fontSize: 14 },
});
