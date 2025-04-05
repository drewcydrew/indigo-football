import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import { NamesProvider } from "@/context/NamesContext";

import RepulsorManagerButton from "@/components/displays/RepulsorManagerButton";
import AddName from "@/components/buttonmodals/AddName";
import CloudSync from "@/components/buttonmodals/CloudSync";
import SelectAllButton from "@/components/buttonmodals/SelectAllButton";

import RandomizeTeamsRandomizeIcon from "@/components/buttonmodals/RandomiseTeamsRandomiseIcon";
import RandomizeTeamsSettingsIcon from "@/components/buttonmodals/RandomizeTeamsSettingsIcon";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NamesProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Players",
            headerLeft: () => <CloudSync />,
            headerRight: () => <AddName />,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="users" color={color} />
            ), // Use users icon
          }}
        />
        <Tabs.Screen
          name="AttendanceScreen"
          options={{
            title: "Attendance",
            headerRight: () => <SelectAllButton />,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="calendar" color={color} />
            ), // Use calendar icon
          }}
        />
        <Tabs.Screen
          name="MatchesScreen"
          options={{
            title: "Matches",
            headerShown: true,
            headerRight: () => <RandomizeTeamsRandomizeIcon />,
            headerLeft: () => <RandomizeTeamsSettingsIcon />,
            tabBarIcon: ({ color }) => <TabBarIcon name="flag" color={color} />, // Use flag icon
          }}
        />
      </Tabs>
    </NamesProvider>
  );
}
