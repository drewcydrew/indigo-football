import { ImageSourcePropType } from "react-native";
import { VideoSource } from "expo-video";

// Export intro content
export const introContent = {
  title: "Indigo Football",
  paragraphs: [
    {
      content:
        "Indigo Football is designed to help organize teams for Monday night football games.\n" +
        "Players are assigned scores, and preferences can be set to avoid certain player pairings.\n" +
        "Easily manage attendance, apply team rules, and generate balanced teams on game day.",
    },
  ],
};

// Define paragraph structure with optional subheading
export interface Paragraph {
  subheading?: string;
  content: string;
}

// Define types for section content
export interface Section {
  title: string;
  paragraphs: Paragraph[];
  video?: VideoSource;
  image?: ImageSourcePropType;
  caption?: string;
}

// Export sections data
export const sections: Section[] = [
  {
    title: "Players",
    video: require("../assets/demovideos/PlayersVideo.mp4"),
    caption: "Players Screen",
    paragraphs: [
      {
        content:
          "Use this screen to manage your list of players.\n\n" +
          "Tap the button in the top left to save or load players from the cloud.\n\n" +
          "Tap the button in the top right to add new players to your roster.",
      },
    ],
  },
  {
    title: "Attendance",
    video: require("../assets/demovideos/AttendanceVideo.mp4"),
    caption: "Attendance Screen",
    paragraphs: [
      {
        content:
          "Set player attendance for upcoming matches on this screen.\n\n" +
          "Use the top button to select or deselect all players.",
      },
    ],
  },
  {
    title: "Matches",
    video: require("../assets/demovideos/MatchesVideo.mp4"),
    caption: "Matches Screen",
    paragraphs: [
      {
        content:
          "Use this screen to prepare and generate teams for match day.\n\n" +
          "Tap the top right button to generate teams. You can edit team names and jersey colors by tapping on them.\n\n" +
          "Use the top left button to open the settings panel, where you can set the number of teams and other game rules.\n\n" +
          "'Repulsors' allow you to define pairs of players who should not be placed on the same team.\n\n" +
          "Toggle 'Sort by Score' to balance individual player ratings or total team scores. Use 'Show Scores' to control score visibility.",
      },
    ],
  },
];
