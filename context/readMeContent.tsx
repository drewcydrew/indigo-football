import { ImageSourcePropType } from "react-native";
import { VideoSource } from "expo-video";

// Export intro content
export const introContent = {
  title: "Indigo Football",
  paragraphs: [
    {
      content:
        "Indigo Football is designed to help organize teams for Monday night football games.\n\n" +
        "Add players and assign them a score from 1 to 5.\n\n" +
        "On game day, set player attendance and choose the number of teams. Then use the app to generate balanced lineups.",
    },
  ],
};

// Define paragraph structure with optional subheading and media
export interface Paragraph {
  subheading?: string;
  content: string;
  video?: VideoSource;
  image?: ImageSourcePropType;
  caption?: string;
}

// Define types for section content
export interface Section {
  title: string;
  paragraphs: Paragraph[];
}

// Export sections data
export const sections: Section[] = [
  {
    title: "Player Screen",
    paragraphs: [
      {
        content:
          "Use this screen to manage your list of players. Tap an existing player to edit their name, score, or description.\n\n" +
          "Tap the plus button in the top-right corner to add a new player and assign a score from 1 to 5.",
        video: require("../assets/democontent/PlayersVideoTrimmed.mp4"),
        caption: "Players Screen",
      },
      {
        video: require("../assets/democontent/LoadPlayersTrimmed.mp4"),
        content:
          "Tap the cloud button in the top left to back up your player collection, or to load an online collection.\n\n" +
          "Be aware: loading a collection is a destructive action—it will overwrite your current data.\n\n" +
          "Several example collections are available: Celtic FC, Tottenham Hotspurs, AC Milan, Real Madrid.",
        caption: "Loading Player Collection",
      },
    ],
  },
  {
    title: "Attendance Screen",
    paragraphs: [
      {
        content:
          "Once your player list is ready, use this screen on match night to select who is attending. Tap the button in the top-right corner to select or deselect all players.",
        video: require("../assets/democontent/AttendanceVideotrimmed.mp4"),
        caption: "Attendance Screen",
      },
    ],
  },
  {
    title: "Matches Screen",
    paragraphs: [
      {
        content:
          "Use this screen to generate teams. Tap the generate button in the top-right corner to re-roll the teams. Tap a jersey panel to change that team’s jersey color.\n\n" +
          "Use the settings icon in the top-left corner to choose the number of teams and customize team creation options.",
        video: require("../assets/democontent/MatchesVideoTrimmed.mp4"),
        caption: "Matches Screen",
      },
      {
        subheading: "Creation Algorithm",
        video: require("../assets/democontent/MatchSettingsTrimmed.mp4"),
        caption: "Team creation settings panel",
        content:
          "You can choose between score-based sorting or random player assignment.\n\n" +
          "Score-based sorting aims to create balanced teams by distributing higher-rated players evenly across all teams, resulting in more competitive matches.\n\n" +
          "Random assignment treats all players equally and shuffles them without considering scores. This method is ideal for a more casual or unpredictable experience.",
      },
      {
        subheading: "Repulsors",
        video: require("../assets/democontent/RepulsorVideoTrimmed.mp4"),
        caption: "Repulsor configuration panel",
        content:
          "Repulsors prevent certain pairs of players from being placed on the same team—helpful for avoiding conflicts, shaking up familiar lineups, or managing rivalries.\n\n" +
          "When generating teams, the app checks for repulsor violations. If any are found, it retries the configuration—up to 50 times. If all attempts fail, it applies a 'best effort' solution that may not respect every repulsor but ensures teams are still formed.",
      },
    ],
  },
];
