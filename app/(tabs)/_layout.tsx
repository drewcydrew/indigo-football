import React from "react";
import { Ionicons } from "@expo/vector-icons";
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
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NamesProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "App Info",
            headerTitleAlign: "center",
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="information-circle" color={color} />
            ), // Use flag icon
          }}
        />
        <Tabs.Screen
          name="PlayersScreen"
          options={{
            title: "Players",
            headerTitleAlign: "center",
            headerLeft: () => <CloudSync />,
            headerRight: () => <AddName />,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="people" color={color} />
            ), // Use users icon
          }}
        />
        <Tabs.Screen
          name="AttendanceScreen"
          options={{
            title: "Attendance",
            headerTitleAlign: "center",
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
            headerTitleAlign: "center",
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
