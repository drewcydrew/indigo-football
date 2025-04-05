import { ImageSourcePropType } from "react-native";
import { VideoSource } from "expo-video";

// Export intro content
export const introContent = {
  title: "Library Lookup",
  paragraphs: [
    {
      content:
        "Library Lookup is a prototype mobile and web application designed to query a database and return information about a specific collection. It can be accessed within the web browser or downloaded on android/ios. \n" +
        "User enters a library and collection code to retrieve a list of books. this list can then be filtered using a single criterion—such as age, total borrow count, or inactivity (Weeding)—or a combination of factors (Transfers).\n" +
        "Once a Weeding or Transfer list has been generated. It can be saved and returned to later. Basic functionality is provided editing, sharing, and interrogating saved lists.",
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
    title: "Weeding",
    video: require("../assets/demovideos/WeedingVideo.mp4"),
    caption: "Weeding Video",
    paragraphs: [
      {
        content:
          "The Weeding screen helps identify items that may be candidates for removal from a library's collection. When the screen first loads, it fetches available library codes. After selecting a library, the relevant collection codes will be displayed.\n\n" +
          "There are four filter types: grubby (high borrow count), dead (long period since last borrowed), old (based on creation date), and dead on arrival (never borrowed). Selecting a filter type will load statistics for that type and display a slider for filtering. \n\n" +
          "A filter slider contains a range (in this example, borrow count ranging 0 -99) and a result preview (in this case a graph that drops off about a third of the way in). Moving the slider will update the result window below. \n\n" +
          "Result panel displays count of found items, tap 'View' to open the results. Click reset to clear filter or rerun if something goes wrong.",
      },
    ],
  },
  {
    title: "Viewing Results",
    video: require("../assets/demovideos/Resultvideo.mp4"),
    caption: "Results Video",
    paragraphs: [
      {
        content:
          "Results are displayed in a list showing key information such as title, author, borrow count, and last activity date. Buttons in the top-right corner allow you to share the list as text or save it for later.\n\n" +
          "Tapping on a book opens a detail view with additional data from the database. This display attempts to fetch a preview image using the Google Books API (not 100% reliable). The globe icon opens a web search for the book in users browser.",
      },
    ],
  },
  {
    title: "Transferring",
    video: require("../assets/demovideos/Transfervideo.mp4"),
    caption: "Transfer Video",
    paragraphs: [
      {
        content:
          "The Transfer screen works similarly to the Weeding screen but uses three connected filters instead of one.\n\n" +
          'After selecting a library and collection, use these filters to define a logic statement, ie "Find FICTION books in BROADMEAD that are older than 4 years, have been borrowed more than 24 times, but haven’t been borrowed in the past 29 months."\n\n' +
          "Note: The sliders for these filters are linked, so currently adjusting one will reload the others. This behaviour might be more distracting than helpful.",
      },
    ],
  },
  {
    title: "Home and Saved Lists",
    video: require("../assets/demovideos/Homevideo.mp4"),
    caption: "Home Screen",
    paragraphs: [
      {
        content:
          "Saved lists appear on the home screen (four demo lists are loaded by default, these can be deleted). Lists are stored locally and will not persist across devices or across app updates. Each saved list includes both the list of books and the parameters used to generate it.\n\n" +
          "Tapping a list name opens it in the Results view, where it can be re-shared or saved under a new name. Tapping the pencil icon opens the query editor on the Weeding or Transfer page. Trash icon for delete.",
      },
    ],
  },
  {
    title: "Roadmap",
    paragraphs: [
      {
        content:
          "Application is a work in progress and suggestions features or improvements would be welcome. Below are some ideas for directions which would add the most immediate value.",
      },
      {
        subheading: "Data access",
        content:
          "The data is currently hosted in an Azure SQL database, accessed via a static endpoint also hosted on Azure. Because the endpoint is cheap and not kept awake when idle, the first query may take up to 20 seconds (subsequent queries in the same session are typically faster).\n\n" +
          "It would be good to either update the endpoint to point at a live database, or use an already available API for data access.",
      },
      {
        subheading: "Better Queries",
        content:
          "Queries at present offer limited filtering options, are easy to break, and are not optimised for speed or user experience. \n\n" +
          "It would be good to offer a smoother experience in which statistic and query updates run in the background rather than interrupting the display, and also add some query options (not sure what exactly).\n\n" +
          "Result structure cold be streamlined for performance. At present it's running the full query from Weeding/Transfer pages, which sometimes returns an unwieldy amount of data and slows performance. A better approach might be to only run statistic queries form these pages, and then have the full query run on results open. \n\n" +
          'Beyond this, potentially some automation could be set up (i.e., "run query every Monday").',
      },
      {
        subheading: "What to do with results",
        content:
          "Results at present are not particularly dynamic. It can be shared (as plain text) and have its name changed, but that’s about it.\n\n" +
          "I suspect that someone using this might benefit from the ability to filter for items within this list and to check items off once they've retrieved them.\n\n" +
          "It would also potentially be useful to allow for sharing results/searches between users (either manually or through a shared account).",
      },
      {
        subheading: "Reports?",
        content:
          "Not sure if this application would benefit form some ability to visualise result data, such as a scatter plot showing age v borrow count or Sankey showing item arrival into high-use/idle/DOA.",
      },
    ],
  },
];
