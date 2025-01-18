# my-react-native-app/README.md

# My React Native App

This is a React Native application that demonstrates the use of multiple tabs with themed components.

## Project Structure

```
my-react-native-app
├── src
│   ├── components
│   │   └── EditScreenInfo.tsx       # Component to display information about the current screen
│   │   └── Themed.tsx               # Themed components for Text and View
│   ├── screens
│   │   └── two.tsx                  # TabTwoScreen component displaying "Tab Two"
│   │   └── three.tsx                # TabThreeScreen component displaying "Tab Three"
├── package.json                      # npm configuration file
├── tsconfig.json                     # TypeScript configuration file
└── README.md                         # Documentation for the project
```

## Installation

To install the dependencies, run:

```
npm install
```

## Running the App

To start the application, use:

```
npm start
```

## Components

- **EditScreenInfo**: Displays information about the current screen.
- **Themed**: Provides styled components based on the current theme.

## Screens

- **TabTwoScreen**: Displays a title "Tab Two" and includes the `EditScreenInfo` component.
- **TabThreeScreen**: Displays a title "Tab Three" and includes the `EditScreenInfo` component.

## License

This project is licensed under the MIT License.