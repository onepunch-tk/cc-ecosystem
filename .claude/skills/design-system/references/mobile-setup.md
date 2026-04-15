# Mobile Library Setup — NativeWind v4 + Unistyles + Reanimated

Configuration procedures for Expo / React Native projects. Verify all APIs via Context7 MCP before applying.

---

## NativeWind v4

### Metro Bundler Configuration (REQUIRED)

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativewind(config, {
  input: "./global.css",
  disableTypeScriptGeneration: false,
  typescriptEnvPath: "nativewind-env.d.ts",
  inlineRem: 14,
});
```

### Tailwind Config

```javascript
// tailwind.config.js
import nativewind from "nativewind/plugin";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [nativewind],
};
```

### Global CSS

```css
/* global.css */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";
```

### Custom Theme Tokens

Add design tokens via `@theme` in the global CSS (same syntax as web Tailwind v4):

```css
/* global.css */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";

@theme {
  --color-primary: #007AFF;
  --color-secondary: #5856D6;
  --color-background: #FFFFFF;
  --color-surface: #F2F2F7;
  --color-error: #FF3B30;
  --color-success: #34C759;

  --font-primary: "Inter";
}
```

### Device Class Breakpoints

Define breakpoints matching iOS/Android device classes:

```css
@theme {
  /* iOS device classes */
  --breakpoint-compact: 0px;
  --breakpoint-regular: 390px;
  --breakpoint-expanded: 430px;

  /* Or Android window size classes */
  --breakpoint-compact: 0px;
  --breakpoint-medium: 600px;
  --breakpoint-expanded: 840px;
}
```

### Babel Config

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo"]],
  };
};
```

### App Entry Point

```tsx
import "./global.css";
```

### Key Differences from Web Tailwind
- Metro wrapper (`withNativewind`) required — processes styles at build time
- `inlineRem` option — configures rem-to-pixel conversion (no browser rem)
- `nativewind/theme` import — provides RN-compatible theme defaults
- `nativewind/plugin` required in Tailwind config
- Breakpoints applied based on device window dimensions, not viewport width
- No special Babel plugin needed — standard `babel-preset-expo` suffices
- RN uses dp natively — no px→dp conversion needed

---

## Unistyles (react-native-unistyles)

### Theme + Breakpoint Configuration

```typescript
// unistyles.config.ts
import { StyleSheet } from 'react-native-unistyles'

const lightTheme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#007AFF',
    secondary: '#5856D6',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
  spacing: (n: number) => n * 8,
  margins: { sm: 4, md: 8, lg: 16, xl: 24 },
}

const darkTheme = {
  colors: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
  },
  spacing: (n: number) => n * 8,
  margins: { sm: 4, md: 8, lg: 16, xl: 24 },
}
```

### TypeScript Type Augmentation (REQUIRED)

```typescript
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof lightTheme
    dark: typeof darkTheme
  }
  export interface UnistylesBreakpoints {
    xs: 0
    sm: 300
    md: 500
    lg: 800
    xl: 1200
  }
}
```

### Initialization

```typescript
StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
    initialTheme: 'light',
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints: {
    xs: 0,      // MUST start at 0 (simulates CSS mobile-first cascading)
    sm: 300,
    md: 500,
    lg: 800,
    xl: 1200,
  },
})
```

### Device Class Breakpoints

Map to platform device classes:

```typescript
// iOS-focused
breakpoints: {
  compact: 0,    // iPhone SE, Mini
  regular: 390,  // iPhone standard
  expanded: 430, // iPad
}

// Android-focused (M3 Window Size Classes)
breakpoints: {
  compact: 0,    // Phones
  medium: 600,   // Foldables, small tablets
  expanded: 840, // Tablets
}

// Cross-platform
breakpoints: {
  xs: 0,
  sm: 390,    // iPhone standard
  md: 600,    // Android medium / iPad Mini
  lg: 840,    // Android expanded
  xl: 1024,   // iPad landscape
}
```

### createStyleSheet with Theme

```tsx
import { StyleSheet } from 'react-native-unistyles'

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,       // Safe area
    paddingBottom: rt.insets.bottom,
  },
  title: {
    fontSize: {
      xs: 24,    // Responsive per breakpoint
      md: 32,
      lg: 40,
    },
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.margins.md,
    borderRadius: 8,
  },
}))
```

### Variants

```tsx
const styles = StyleSheet.create((theme) => ({
  button: {
    padding: theme.spacing(2),
    borderRadius: 8,
    variants: {
      variant: {
        default: { backgroundColor: theme.colors.primary },
        destructive: { backgroundColor: theme.colors.error },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        },
      },
      size: {
        small:  { height: 32, paddingHorizontal: theme.spacing(2) },
        medium: { height: 40, paddingHorizontal: theme.spacing(3) },
        large:  { height: 48, paddingHorizontal: theme.spacing(4) },
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        size: 'large',
        styles: { borderWidth: 3 },
      },
    ],
  },
}))
```

### Theme Switching

```tsx
import { UnistylesRuntime } from 'react-native-unistyles'

// Manual switch
UnistylesRuntime.setTheme('dark')

// System-adaptive: set adaptiveThemes: true in configure()
// Requires both 'light' and 'dark' themes registered
```

---

## Reanimated

No configuration file needed. Verify only:

1. **Package installed**: Check `react-native-reanimated` in `package.json`
2. **Babel plugin**: Verify `react-native-reanimated/plugin` is the LAST plugin in `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo"]],
    plugins: ["react-native-reanimated/plugin"],  // Must be last
  };
};
```

3. **Version compatibility**: Check Expo SDK compatibility via Context7 MCP

---

## Token Integration Checklist

Before finishing mobile library setup, verify:

- [ ] Metro config wrapped with `withNativewind` (if using NativeWind)
- [ ] Global CSS imported at app entry point
- [ ] Unistyles `StyleSheet.configure()` called before any component renders
- [ ] Breakpoints start at 0 (Unistyles requirement)
- [ ] TypeScript type augmentation matches theme/breakpoint definitions
- [ ] Theme colors match `tokens.json` values
- [ ] Reanimated Babel plugin is LAST in plugins array
- [ ] Safe area handled via `rt.insets` (Unistyles) or `useSafeAreaInsets` (NativeWind)
