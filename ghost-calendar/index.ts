export * from "./react-native";
export * from "./core";

import { registerRootComponent } from "expo";
import App from "./App";
registerRootComponent(App);
