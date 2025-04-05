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
        "On game day, set attendance and the number of teams, then use the app to create balanced teams.",
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
    title: "Player Screen",
    video: require("../assets/demovideos/PlayersVideo.mp4"),
    caption: "Players Screen",
    paragraphs: [
      {
        content:
          "Use this screen to manage your list of players. Tap an existing player to edit their name, score, or description.\n\n" +
          "Tap the button in the top right to add new players, assigning them a score from 1 to 5 (this score will be used when creating teams).\n\n" +
          "Tap the button in the top left to save or load players from the cloud.",
      },
    ],
  },
  {
    title: "Attendance Screen",
    video: require("../assets/demovideos/AttendanceVideo.mp4"),
    caption: "Attendance Screen",
    paragraphs: [
      {
        content:
          "Once your player list is ready, use this screen on match night to select which players are available. Tap the top right button to select or deselect all players.",
      },
    ],
  },
  {
    title: "Matches Screen",
    video: require("../assets/demovideos/MatchesVideo.mp4"),
    caption: "Matches Screen",
    paragraphs: [
      {
        content:
          "Use this screen to generate teams. Tap the generate button in the top right to re-roll the teams. Tap a jersey panel to change that team’s jersey color.\n\n" +
          "Tap the settings icon in the top left to choose the number of teams and adjust additional team creation rules.",
      },
    ],
  },
  {
    title: "Team Creation Settings",
    paragraphs: [
      {
        subheading: "Repulsors",
        content:
          "Repulsors act as constraints in the team-building process, preventing specific pairs of players from being placed on the same team. This might be used to separate rivals, avoid known conflicts, or just mix things up. During team generation, the algorithm checks each team to see if any repulsor pair appears together. If a violation is found, the current team configuration is rejected and the algorithm tries again. This continues for up to 50 attempts, after which the app falls back to a 'best effort' distribution that may not fully respect all repulsors—ensuring team creation still works, even when perfect separation isn't possible.",
      },
      {
        subheading: "Sort by Score",
        content:
          "Sorting by score versus random player assignment represents two different strategies for fairness. When sorting by score, the algorithm aims to build balanced teams by distributing players based on their skill levels—higher-scoring players are spread across teams to keep total team scores as even as possible. In contrast, the random player method treats all players equally, shuffling them with no regard for skill, which can lead to more unpredictable and potentially unbalanced teams. The score-based method is ideal when competitive balance is important, while the random method emphasizes spontaneity and fun.",
      },
      {
        subheading: "Show Scores",
        content:
          "Enable this setting to display the individual score for each team member, along with the total score for the team.",
      },
    ],
  },
];
