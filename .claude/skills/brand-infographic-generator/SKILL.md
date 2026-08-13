---
name: brand-infographic-generator
description: Converts Felicity IDC product information into a precise, brand-locked image-generation prompt for a product infographic. Use whenever the user wants a product infographic, marketing image prompt, or ad-style graphic for Felicity IDC (or a similarly branded data-centre/equipment product) and gives (or should give) a product name, variant, headline, highlighted key words, product photo description, and 4 icon/label pairs. Enforces a strict black/white/vibrant-orange 3-color system with alternating dark/light layout rules.
---

# Brand-Aligned Product Infographic Generator

Convert product information into a precise image-generation prompt for a Felicity IDC product infographic, strictly following the brand's 3-color system and fixed layout structure. This skill produces the *prompt text* to hand to an image generator — it does not generate the image itself.

## Core Brand Rules

1. **Palette:** Strictly BLACK, WHITE, and VIBRANT ORANGE. Never include blue, green, or any secondary accent color.
2. **Alternating Backgrounds** (chosen by the `Variant` input):
   - **Dark Variant:** Background = Black | Primary Text = White | Highlights/Icons/Lines = Vibrant Orange | Background Accent = Orange Gradient Whorl/Glow.
   - **Light Variant:** Background = White | Primary Text = Black | Highlights/Icons/Lines = Vibrant Orange | Background Accent = Subtle Orange Gradient Shine.
3. **Layout Structure** (fixed, do not rearrange):
   - Top Right: Logo ("FELICITY IDC" / "Internet Data Centre")
   - Top Left: Headline + Sub-line (key benefit words highlighted in Orange) + Orange accent line
   - Right Side: Photorealistic equipment imagery rendered with Orange accents
   - Bottom Row: 4 circular line-art icons in Orange with high-contrast text labels

## Workflow

1. **Collect inputs.** Gather, or ask the user for, exactly these six fields:
   - **Product Name** (e.g., UPS Battery System)
   - **Variant**: `Black` or `White`
   - **Headline** (e.g., Uninterrupted Power for Zero Downtime)
   - **Key Words to Highlight** (e.g., Modular Lithium UPS)
   - **Product Photo Description** (e.g., Row of server rack battery cabinets)
   - **4 Icons & Labels** (e.g., 1: Uptime, 2: Swap, 3: Eco, 4: Scale)

   If any field is missing, ask for it before generating — do not invent product facts, but you may propose reasonable icon symbols (see step 2) if only labels are given.

2. **Map Variant to layout values:**
   - `Black` variant → Background = Black, Text = White, Background Accent = "Orange Gradient Whorl/Glow"
   - `White` variant → Background = White, Text = Black, Background Accent = "Subtle Orange Gradient Shine"

3. **Choose an icon symbol per label** (simple line-art concept matching the label, e.g., "Uptime" → clock/checkmark, "Swap" → two arrows in a loop, "Eco" → leaf-free alternative like a recycling arrow triangle rendered only in orange, "Scale" → expanding arrows). Never use green for "Eco" concepts — render everything in Vibrant Orange line art regardless of theme.

4. **Fill the output template below exactly**, substituting all bracketed values. Keep every section header (**Color Setup & Background:**, **Header:**, **Copy:**, **Product Photo:**, **Footer Icons:**, **Style:**) verbatim, and keep the "no blue or green allowed" sentence verbatim — it's a hard constraint reminder for the image model.

5. **Output only the final prompt** (plus, optionally, one short line noting which variant was used), ready to paste into an image generator. Do not add extra commentary, alternate versions, or explanations unless the user asks for them.

## Output Template

```
A professional, clean corporate marketing infographic layout.

**Color Setup & Background:** [Black/White] background with a subtle, smooth [Orange Gradient Whorl/Subtle Orange Shine] accent. The palette strictly consists of Black, White, and Vibrant Orange—no blue or green allowed.

**Header:** On the top right, a logo for 'FELICITY IDC' in [White/Black] and Vibrant Orange, with 'Internet Data Centre' below in [White/Black].

**Copy:** On the left, large bold sans-serif headline in [White/Black]: '[HEADLINE]'. Key words '[KEY WORDS]' are in Vibrant Orange. A thin Vibrant Orange line sits directly underneath. Below, explanatory body copy in [White/Black] with critical terms in Vibrant Orange.

**Product Photo:** On the right, a high-resolution photograph of [PRODUCT PHOTO DESCRIPTION] inside a clean, modern facility. The equipment hardware uses a sleek dark/light finish with strategic Vibrant Orange accent trims and panels.

**Footer Icons:** At the bottom, a row of 4 Vibrant Orange line-art icons inside circular frames, connected by a horizontal Vibrant Orange line. Labels in [White/Black] read:
1. [Icon 1 Symbol]: [Label 1]
2. [Icon 2 Symbol]: [Label 2]
3. [Icon 3 Symbol]: [Label 3]
4. [Icon 4 Symbol]: [Label 4]

**Style:** High-tech corporate presentation slide, studio lighting, crisp typography, photorealistic hardware.
```

## Example

**Input:**
- Product Name: UPS Battery System
- Variant: Black
- Headline: Uninterrupted Power for Zero Downtime
- Key Words to Highlight: Modular Lithium UPS
- Product Photo Description: Row of server rack battery cabinets
- 4 Icons & Labels: 1: Uptime, 2: Swap, 3: Eco, 4: Scale

**Output:**

```
A professional, clean corporate marketing infographic layout.

**Color Setup & Background:** Black background with a subtle, smooth Orange Gradient Whorl/Glow accent. The palette strictly consists of Black, White, and Vibrant Orange—no blue or green allowed.

**Header:** On the top right, a logo for 'FELICITY IDC' in White and Vibrant Orange, with 'Internet Data Centre' below in White.

**Copy:** On the left, large bold sans-serif headline in White: 'Uninterrupted Power for Zero Downtime'. Key words 'Modular Lithium UPS' are in Vibrant Orange. A thin Vibrant Orange line sits directly underneath. Below, explanatory body copy in White with critical terms in Vibrant Orange.

**Product Photo:** On the right, a high-resolution photograph of a row of server rack battery cabinets inside a clean, modern facility. The equipment hardware uses a sleek dark finish with strategic Vibrant Orange accent trims and panels.

**Footer Icons:** At the bottom, a row of 4 Vibrant Orange line-art icons inside circular frames, connected by a horizontal Vibrant Orange line. Labels in White read:
1. Clock with checkmark: Uptime
2. Two looping arrows: Swap
3. Recycling-style triangle arrows: Eco
4. Expanding corner arrows: Scale

**Style:** High-tech corporate presentation slide, studio lighting, crisp typography, photorealistic hardware.
```
