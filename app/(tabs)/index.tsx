import React from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "../../components/Themed";
import { useVideoPlayer, VideoView } from "expo-video";

import { introContent, sections, Paragraph } from "../../context/readMeContent";

const ReadMe = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  // Helper component to render media (image or video)
  const MediaComponent = ({
    paragraph,
    isWide,
  }: {
    paragraph: Paragraph;
    isWide: boolean;
  }) => {
    if (paragraph.image) {
      return (
        <View style={styles.mediaWrapper}>
          <Image
            source={paragraph.image}
            style={[
              styles.media,
              isWide ? styles.mediaWide : styles.mediaNarrow,
            ]}
            resizeMode="contain"
            borderRadius={8}
          />
          {paragraph.caption && (
            <Text style={styles.caption}>{paragraph.caption}</Text>
          )}
        </View>
      );
    }

    if (paragraph.video) {
      const player = useVideoPlayer(paragraph.video, (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
      });

      return (
        <View style={styles.mediaWrapper}>
          <View
            style={[
              styles.videoContainer,
              isWide
                ? styles.videoContainerWide
                : styles.videoContainerPortrait,
            ]}
          >
            <VideoView
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
              }}
              player={player}
              contentFit="contain"
            />
          </View>
          {paragraph.caption && (
            <Text style={styles.caption}>{paragraph.caption}</Text>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/iconrounded.png")}
              style={styles.logo}
              resizeMode="contain"
              height={80}
              width={200}
            />
          </View>

          {/* Custom Intro Section */}
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>{introContent.title}</Text>
            {introContent.paragraphs.map((paragraph, i) => (
              <Text key={i} style={styles.introText}>
                {paragraph.content}
              </Text>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.sectionRow}>
              <Text style={styles.title}>{section.title}</Text>

              {section.paragraphs.map((paragraph, paragraphIndex) => {
                const hasMedia = paragraph.image || paragraph.video;

                return (
                  <View
                    key={paragraphIndex}
                    style={[
                      styles.paragraphContainer,
                      isWide && hasMedia
                        ? {
                            flexDirection: "row",
                            alignItems: "flex-start",
                          }
                        : undefined,
                    ]}
                  >
                    <View
                      style={[
                        styles.textContainer,
                        isWide && hasMedia
                          ? { flex: 1, marginRight: 16 }
                          : undefined,
                      ]}
                    >
                      {paragraph.subheading && (
                        <Text style={styles.subheading}>
                          {paragraph.subheading}
                        </Text>
                      )}
                      <Text style={styles.paragraph}>{paragraph.content}</Text>
                    </View>

                    {hasMedia && (
                      <MediaComponent paragraph={paragraph} isWide={isWide} />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "#ffffff",
    flex: 1,
  },
  contentWrapper: {
    padding: 16,
    maxWidth: Platform.OS === "web" ? 1000 : "100%",
    alignSelf: "center",
    width: "100%",
  },
  sectionRow: {
    marginBottom: 32,
    width: "100%",
  },
  textContainer: {
    flex: 1,
  },
  spacing: {
    paddingRight: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    //color: "#333",
  },
  image: {
    borderRadius: 8,
  },
  imageWide: {
    width: 300,
    height: 600,
  },
  imageNarrow: {
    //width: 300,
    height: 600,
    //marginTop: 16,
  },
  video: {
    borderRadius: 8,
    //backgroundColor: "#000",
  },
  videoWide: {
    width: 300,
    height: 300,
  },
  videoNarrow: {
    width: 300,
    height: 600,
  },
  media: {
    borderRadius: 8,
  },
  mediaWide: {
    width: 300,
    height: 450,
    alignSelf: "flex-start",
    maxWidth: "100%", // Prevents overflow on small screens
  },
  mediaNarrow: {
    width: 300,
    height: 500,
    alignSelf: "center",
    maxWidth: "100%", // Prevents overflow on small screens
  },
  videoContainer: {
    overflow: "hidden",
    borderRadius: 8,
    //backgroundColor: "#000",
  },
  videoContainerWide: {
    width: 270, // Adjusted for portrait video in desktop view
    height: 480,
    alignSelf: "flex-start",
  },
  videoContainerPortrait: {
    // New style specifically for portrait videos
    width: 280,
    height: 500,
    aspectRatio: 9 / 16, // Portrait aspect ratio
    marginTop: 16,
  },
  videoContainerNarrow: {
    width: 300,
    height: 500,
    aspectRatio: 16 / 9,
    marginTop: 16,
  },
  videoPlayer: {
    flex: 1,
    width: 300,
    height: 600,
  },
  mediaWrapper: {
    alignItems: "center",
  },
  caption: {
    fontSize: 14,
    fontStyle: "italic",
    //color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    maxWidth: 400,
    paddingHorizontal: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 24,
    width: "100%",
    borderRadius: 20,
  },
  logo: {
    width: Platform.OS === "web" ? 300 : 500,
    height: Platform.OS === "web" ? 120 : 300,
    borderRadius: 20,
  },
  introSection: {
    marginBottom: 32,
    alignItems: "center",
    padding: 16,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    //color: "#333",
    textAlign: "center",
  },
  introText: {
    fontSize: 18,
    lineHeight: 28,
    //color: "#444",
    textAlign: "center",
    maxWidth: 800,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
    marginBottom: 32,
  },
  paragraphContainer: {
    marginBottom: 12,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    //color: "#444",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    //color: "#444",
  },
});

export default ReadMe;
