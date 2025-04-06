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
        "On game day, set attendance and the number of teams, then use the app to generate balanced teams.",
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
          "Tap the button in the top right to add new players and assign them a score from 1 to 5. This score is used when generating teams.\n\n" +
          "Use the button in the top left to save or load players from the cloud.",
        video: require("../assets/democontent/PlayersVideo.mp4"),
        caption: "Players Screen",
      },
    ],
  },
  {
    title: "Attendance Screen",
    paragraphs: [
      {
        content:
          "Once your player list is ready, use this screen on match night to select which players are available. Tap the top right button to select or deselect all players.",
        video: require("../assets/democontent/AttendanceVideo.mp4"),
        caption: "Attendance Screen",
      },
    ],
  },
  {
    title: "Matches Screen",
    paragraphs: [
      {
        content:
          "Use this screen to generate teams. Tap the generate button in the top right to re-roll the teams. Tap a jersey panel to change that team's jersey color.\n\n" +
          "Use the settings icon in the top left to choose the number of teams and adjust additional team creation settings.",
        video: require("../assets/democontent/MatchesVideo.mp4"),
        caption: "Matches Screen",
      },
    ],
  },
  {
    title: "Team Creation Settings",
    paragraphs: [
      {
        image: require("../assets/democontent/MatchSettings.png"),
        content:
          "When creating teams, you can configure the number of teams, choose whether to display scores, and adjust the team creation algorithm and repulsor settings.",
        caption: "Team creation settings panel",
      },
      {
        subheading: "Creation Algorithm",
        content:
          "Sorting by score versus using random player assignment offers two different approaches to fairness. When sorting by score, the algorithm aims to build balanced teams by distributing players based on skill levels—higher-scoring players are spread across teams to keep total team scores even.\n\n" +
          "Random assignment treats all players equally, shuffling them without considering score. This method can result in more unpredictable and potentially unbalanced teams. Use score-based sorting when competitive balance is important, or random assignment for spontaneity and fun.",
      },
      {
        subheading: "Repulsors",
        video: require("../assets/democontent/RepulsorVideo.mp4"),
        caption: "Repulsor configuration panel",
        content:
          "Repulsors act as constraints during team generation, preventing specific pairs of players from being placed on the same team. This can help separate rivals, avoid conflicts, or mix things up.\n\n" +
          "When generating teams, the algorithm checks each team to ensure no repulsor pair is placed together. If a conflict is found, the configuration is rejected and retried—up to 50 times. After 50 failed attempts, the app uses a 'best effort' distribution that may not perfectly honor all repulsors but ensures teams are still created.",
      },
    ],
  },
];
