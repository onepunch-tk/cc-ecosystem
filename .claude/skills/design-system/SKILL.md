---
name: design-system
description: "Design system bootstrap, token schema definition, and platform-specific library setup procedures. Loaded by the ux-design-lead agent to create design-system.md, tokens.json, and configure UI library settings. Use `/design-system update` to refresh web-setup.md and mobile-setup.md to match installed library versions."
allowed-tools: Read, Write, Glob, Grep, Bash
argument-hint: "[update]"
---

# Design System Skill

Procedures and references for bootstrapping a design system, defining design tokens, and configuring UI libraries per platform.

---

## Design System Bootstrap Procedure

When invoked by the ux-design-lead agent, follow this sequence:

### 1. Gather Context

Read the following files (the agent should have already read these during Pre-Work):

- `docs/PRD.md` — Product purpose, target users, brand direction, tone
- `docs/ROADMAP.md` — Implementation phases, component prioritization
- `package.json` — Installed UI/UX libraries and versions

If PRD.md or ROADMAP.md are missing, proceed autonomously using available context (package.json, existing code patterns, project structure).

### 2. Check for existing design system files

Before creating anything, check if `docs/design-system/` already contains files (e.g., generated via Stitch or other design tools). If files exist:
- **Read and adopt them as source of truth** — do NOT overwrite
- Identify the token format used (DTCG, Stitch, custom) and record it
- Skip to the Library Setup Procedure

If no design system files exist, create the following:

### 3. Create `docs/design-system/design-system.md`

Document the following:

```markdown
# Design System — [Project Name]

## Token Format
[DTCG ($value/$type) | Stitch (exported) | Custom — specify]

## Design Language
- Brand personality: [formal / casual / technical / playful]
- Visual density: [spacious / comfortable / compact]
- Color philosophy: [monochromatic / analogous / complementary / triadic]

## Platform Strategy
- Target platforms: [Web | Mobile (iOS/Android) | Both]
- Responsive approach: [Mobile-first (web) | Device class adaptive (mobile)]

## Typography
- Primary font family: [font name]
- Type scale: [reference to tokens.json typography section]

## Color Palette
- Primary: [purpose and usage context]
- Secondary: [purpose and usage context]
- Accent: [purpose and usage context]
- Semantic: success, warning, error, info

## Component Guidelines
- Naming convention: [PascalCase components, camelCase props]
- Composition pattern: [compound components / render props / slots]
- State coverage: hover, focus, active, disabled, loading, error, empty

## Spacing System
- Base unit: [4pt / 8pt grid]
- Scale: xs, sm, md, lg, xl, 2xl

## Responsive Breakpoints
### Web
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px

### Mobile (iOS — Apple HIG)
- Compact: < 390pt, Regular: 390-430pt, Expanded: > 430pt

### Mobile (Android — Material Design 3)
- Compact: < 600dp, Medium: 600-840dp, Expanded: > 840dp
```

### 4. Create `docs/design-system/tokens.json`

If `tokens.json` already exists (e.g., Stitch export), read and adopt it. Otherwise, create it using the project's declared Token Format. Default to DTCG if no preference stated.

#### DTCG Token Schema (Default)

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "primary": {
      "$value": "#007AFF",
      "$type": "color",
      "$description": "Primary brand color"
    },
    "on-primary": {
      "$value": "#FFFFFF",
      "$type": "color"
    },
    "secondary": {
      "$value": "#5856D6",
      "$type": "color"
    },
    "on-secondary": {
      "$value": "#FFFFFF",
      "$type": "color"
    },
    "background": {
      "$value": "#FFFFFF",
      "$type": "color"
    },
    "surface": {
      "$value": "#F2F2F7",
      "$type": "color"
    },
    "error": {
      "$value": "#FF3B30",
      "$type": "color"
    },
    "success": {
      "$value": "#34C759",
      "$type": "color"
    },
    "warning": {
      "$value": "#FF9500",
      "$type": "color"
    }
  },
  "typography": {
    "font-family": {
      "primary": {
        "$value": "Inter, system-ui, sans-serif",
        "$type": "fontFamily"
      }
    },
    "font-size": {
      "xs": { "$value": "12px", "$type": "dimension" },
      "sm": { "$value": "14px", "$type": "dimension" },
      "md": { "$value": "16px", "$type": "dimension" },
      "lg": { "$value": "18px", "$type": "dimension" },
      "xl": { "$value": "20px", "$type": "dimension" },
      "2xl": { "$value": "24px", "$type": "dimension" },
      "3xl": { "$value": "30px", "$type": "dimension" },
      "4xl": { "$value": "36px", "$type": "dimension" }
    },
    "font-weight": {
      "regular": { "$value": 400, "$type": "number" },
      "medium": { "$value": 500, "$type": "number" },
      "semibold": { "$value": 600, "$type": "number" },
      "bold": { "$value": 700, "$type": "number" }
    },
    "line-height": {
      "tight": { "$value": 1.25, "$type": "number" },
      "normal": { "$value": 1.5, "$type": "number" },
      "relaxed": { "$value": 1.75, "$type": "number" }
    }
  },
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" },
    "xl": { "$value": "32px", "$type": "dimension" },
    "2xl": { "$value": "48px", "$type": "dimension" },
    "3xl": { "$value": "64px", "$type": "dimension" }
  },
  "border-radius": {
    "none": { "$value": "0px", "$type": "dimension" },
    "sm": { "$value": "4px", "$type": "dimension" },
    "md": { "$value": "8px", "$type": "dimension" },
    "lg": { "$value": "12px", "$type": "dimension" },
    "xl": { "$value": "16px", "$type": "dimension" },
    "2xl": { "$value": "24px", "$type": "dimension" },
    "full": { "$value": "9999px", "$type": "dimension" }
  },
  "shadow": {
    "sm": {
      "$value": "0 1px 2px rgba(0, 0, 0, 0.05)",
      "$type": "shadow"
    },
    "md": {
      "$value": "0 4px 6px rgba(0, 0, 0, 0.1)",
      "$type": "shadow"
    },
    "lg": {
      "$value": "0 10px 15px rgba(0, 0, 0, 0.1)",
      "$type": "shadow"
    }
  },
  "breakpoint": {
    "sm": { "$value": "640px", "$type": "dimension" },
    "md": { "$value": "768px", "$type": "dimension" },
    "lg": { "$value": "1024px", "$type": "dimension" },
    "xl": { "$value": "1280px", "$type": "dimension" }
  }
}
```

#### Non-DTCG Formats

If the project uses Stitch export or custom format, adapt accordingly. The key requirement is that `design-system.md` declares the chosen format under `Token Format:` so the Quality Self-Check can validate against it.

---

## Library Setup Procedure

After design system documents are created and the Library Research Protocol has verified APIs:

### 1. Detect Platform

- Check `package.json` dependencies for platform indicators:
  - Web: `tailwindcss`, `@shadcn/ui`, `react-router`, `next`
  - Mobile: `expo`, `react-native`, `nativewind`, `react-native-unistyles`
  - Both: presence of web AND mobile indicators

### 2. Detect Workspace Structure

- **Monorepo**: If `turbo.json`, `pnpm-workspace.yaml`, or root `package.json` with `workspaces` field exists, navigate to the relevant app/package directory
- **Single project**: Configure at project root

### 3. Load Platform-Specific Reference

- **Web**: Read `references/web-setup.md` and follow its procedures
- **Mobile**: Read `references/mobile-setup.md` and follow its procedures
- Both: Execute web setup in the web app directory, mobile setup in the mobile app directory

### 4. Token-to-Config Conversion

#### DTCG Format
Extract `$value` from each token and map to the platform's config format:

```typescript
// Pseudo-code for DTCG → Tailwind v4 @theme
// tokens.json: { "color": { "primary": { "$value": "#007AFF", "$type": "color" } } }
// → CSS: --color-primary: #007AFF;
```

#### Non-DTCG Format
Read the token values directly from the JSON structure and map accordingly.

### 5. Constraints

- **Do NOT install packages.** If a library is referenced but not in `package.json`, inform the user.
- **Do NOT modify package.json.** Only create/modify configuration files.
- **Verify API compatibility** via Context7 MCP before writing any config file.

---

## `/design-system update` — Refresh Setup References

When invoked with the `update` argument, this skill refreshes `references/web-setup.md` and `references/mobile-setup.md` to match the project's currently installed library versions.

### Procedure

#### 1. Detect Workspace
- Check for `turbo.json`, `pnpm-workspace.yaml`, or root `package.json` with `workspaces` field
- **Monorepo**: Scan all app/package directories for `package.json` files
- **Single project**: Read root `package.json`

#### 2. Identify UI/UX Libraries and Versions
Scan `package.json` `dependencies` and `devDependencies` for:

| Library | Package Name |
|---------|-------------|
| Tailwind CSS | `tailwindcss` |
| shadcn/ui | `@shadcn/ui` or check `components.json` |
| NativeWind | `nativewind` |
| Unistyles | `react-native-unistyles` |
| Reanimated | `react-native-reanimated` |
| Expo | `expo` |

Record the **exact version** of each found library.

#### 3. Learn Latest Documentation
For each detected library:
1. Use **Context7 MCP** (`resolve-library-id` → `query-docs`) to fetch version-specific documentation
2. Use **WebSearch** to find official migration guides or breaking changes for the installed version
3. Focus on: configuration API, setup requirements, breaking changes from previous versions

#### 4. Update Reference Files
Based on learned documentation:
- **`references/web-setup.md`**: Update Tailwind CSS config syntax, shadcn/ui setup, CSS variables pattern to match installed versions
- **`references/mobile-setup.md`**: Update NativeWind Metro config, Unistyles API, Reanimated Babel plugin to match installed versions

For each update:
- Preserve the file structure (sections, headings, checklist)
- Replace code examples with version-accurate API usage
- Add version notes where behavior differs from the default reference (e.g., "NativeWind v5 uses...")
- Note any deprecated APIs that should be avoided

#### 5. Report Changes
After updating, report:
- Which libraries were found and their versions
- What changed in each reference file
- Any libraries NOT found (skip those sections, do not remove them)
