import React, { useState } from "react";
import { Box, Text } from "ink";
import HomeScreen from "./screens/HomeScreen.js";
import RequestScreen from "./screens/RequestScreen.js";
import CollectionsScreen from "./screens/CollectionsScreen.js";
import HistoryScreen from "./screens/HistoryScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";

type Screen = "home" | "request" | "collections" | "history" | "setting";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case "request":
        return <RequestScreen onBack={() => setCurrentScreen("home")} />;
      case "collections":
        return <CollectionsScreen onBack={() => setCurrentScreen("home")} />;
      case "history":
        return <HistoryScreen onBack={() => setCurrentScreen("home")} />;
      case "setting":
        return <SettingsScreen onBack={() => setCurrentScreen("home")} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <Box flexDirection="column">
      {renderScreen()}
    </Box>
  );
}