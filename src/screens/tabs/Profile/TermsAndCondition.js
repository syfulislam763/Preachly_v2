import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { get_terms } from '../TabsAPI';
import ReusableNavigation from '@/components/ReusabeNavigation';
import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

// ── helpers ────────────────────────────────────────────────────────────────

const parseMarkdown = (raw = '') => {
  const lines = raw.split(/\r?\n/);
  const sections = [];
  let currentSection = null;

  const pushSection = () => {
    if (currentSection) sections.push(currentSection);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim() || line.trim() === '---') continue;
    if (line.startsWith('# ')) continue;

    if (line.startsWith('## ')) {
      pushSection();
      currentSection = { heading: line.replace('## ', '').trim(), items: [] };
      continue;
    }

    if (line.trim().startsWith('- ')) {
      if (!currentSection) currentSection = { heading: null, items: [] };
      currentSection.items.push({ type: 'bullet', text: line.replace(/^[\s-]+/, '') });
      continue;
    }

    if (!currentSection) currentSection = { heading: null, items: [] };
    currentSection.items.push({ type: 'paragraph', text: line.trim() });
  }
  pushSection();
  return sections;
};

const RichText = ({ text = '', style }) => {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <Text style={style}>
      {tokens.map((tok, idx) => {
        if (tok.startsWith('**') && tok.endsWith('**')) {
          return (
            <Text key={idx} style={{ fontFamily: 'NunitoBold' }}>
              {tok.slice(2, -2)}
            </Text>
          );
        }
        if (tok.startsWith('*') && tok.endsWith('*')) {
          return (
            <Text key={idx} style={{ fontFamily: 'NunitoItalic', color: '#6B7280' }}>
              {tok.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={idx}>{tok}</Text>;
      })}
    </Text>
  );
};

// ── SectionCard ────────────────────────────────────────────────────────────

const SectionCard = ({ section, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 380, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        shadowColor: '#0B172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        marginHorizontal: 16,
        marginBottom: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Accent stripe — amber/gold to distinguish from Privacy (teal) */}
      <View style={{ height: 3, backgroundColor: '#f7da9b' }} />

      <View style={{ padding: 16 }}>
        {section.heading && (
          <Text
            style={{
              fontFamily: 'NunitoBold',
              fontSize: 15,
              color: '#0B172A',
              marginBottom: 10,
            }}
          >
            {section.heading}
          </Text>
        )}

        {section.items.map((item, i) => {
          if (item.type === 'bullet') {
            return (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#B45309',
                    marginTop: 6,
                    marginRight: 10,
                    flexShrink: 0,
                  }}
                />
                <RichText
                  text={item.text}
                  style={{ fontFamily: 'NunitoRegular', fontSize: 13.5, color: '#374151', lineHeight: 20, flex: 1 }}
                />
              </View>
            );
          }
          return (
            <RichText
              key={i}
              text={item.text}
              style={{ fontFamily: 'NunitoRegular', fontSize: 13.5, color: '#374151', lineHeight: 20, marginBottom: 6 }}
            />
          );
        })}
      </View>
    </Animated.View>
  );
};

// ── main screen ─────────────────────────────────────────────────────────────

const TermsAndCondition = ({ navigation }) => {
  const [sections, setSections] = useState([]);
  const [meta, setMeta] = useState({ title: 'Terms of Service', updated: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const heroAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    get_terms((res, ok) => {
      if (ok && res?.data?.content) {
        const raw = res.data.content;
        const updatedMatch = raw.match(/\*Last updated:([^*]+)\*/);
        const updated = updatedMatch ? updatedMatch[1].trim() : '';

        setSections(parseMarkdown(raw));
        setMeta({ title: res.data.title || 'Terms of Service', updated });
      } else {
        setError(true);
      }
      setLoading(false);

      Animated.timing(heroAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    });
  }, []);

  const NavHeader = () => (
    <ReusableNavigation
      leftComponent={() => (
        <BackButton navigation={navigation} cb={() => navigation.goBack()} />
      )}
      middleComponent={() => (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'NunitoSemiBold', fontSize: 18, color: '#0B172A', marginTop: 3 }}>
            Terms of Service
          </Text>
        </View>
      )}
      RightComponent={() => <View style={{ width: 44 }} />}
      backgroundStyle={{ backgroundColor: '#F8FAFA', height: 65 }}
    />
  );

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8FAFA' }}>
        <NavHeader />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#B45309" />
          <Text style={{ fontFamily: 'NunitoRegular', fontSize: 13, color: '#9CA3AF', marginTop: 12 }}>
            Loading terms…
          </Text>
        </View>
      </View>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8FAFA' }}>
        <NavHeader />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>⚠️</Text>
          <Text style={{ fontFamily: 'NunitoBold', fontSize: 16, color: '#0B172A', marginBottom: 6, textAlign: 'center' }}>
            Couldn't load terms
          </Text>
          <Text style={{ fontFamily: 'NunitoRegular', fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
            Please check your connection and try again.
          </Text>
        </View>
      </View>
    );
  }

  // ── CONTENT ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFA' }}>
      <NavHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Hero banner */}
        <Animated.View
          style={{
            opacity: heroAnim,
            transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }],
            backgroundColor: '#0B172A',
            marginHorizontal: 16,
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
          }}
        >
          {/* <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: 'rgba(180,83,9,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 26 }}>📋</Text>
          </View> */}

          <Text style={{ fontFamily: 'NunitoBold', fontSize: 22, color: '#FFFFFF', textAlign: 'center', marginBottom: 6 }}>
            {meta.title}
          </Text>

          {meta.updated ? (
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                marginTop: 4,
              }}
            >
              <Text style={{ fontFamily: 'NunitoRegular', fontSize: 12, color: '#A3B8B5' }}>
                Last updated: {meta.updated}
              </Text>
            </View>
          ) : null}

          <Text
            style={{
              fontFamily: 'NunitoRegular',
              fontSize: 13,
              color: '#A3B8B5',
              textAlign: 'center',
              marginTop: 10,
              lineHeight: 18,
            }}
          >
            Operated by 1nfinite Aura Studios Inc. · Ontario, Canada
          </Text>
        </Animated.View>

        {/* Section cards */}
        {sections.map((section, i) => (
          <SectionCard key={i} section={section} index={i} />
        ))}

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text style={{ fontFamily: 'NunitoRegular', fontSize: 12, color: '#9CA3AF' }}>
            © 2025 1nfinite Aura Studios Inc. — Preachly
          </Text>
          <Text style={{ fontFamily: 'NunitoRegular', fontSize: 12, color: '#f7da9b', marginTop: 2 }}>
            info@preachly.app
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndCondition;