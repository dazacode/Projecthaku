export const themes = {
  light: {
    name: "Light Mode (Sakura)",
    colors: {
      background: "#F8F4E6", // Shironeri
      primary: "#FFB6C1",   // Sakura
      secondary: "#A8D8B9", // Wakaba
      text: "#6B4C3A",      // Kogecha
      highlight: "#FDEDE8"  // Usuzakura
    }
  },
  dark: {
    name: "Dark Mode (Midnight)",
    colors: {
      background: "#2E2C2F", // Sumi
      primary: "#FFB6C1",    // Sakura
      secondary: "#6B4C3A",  // Kogecha
      text: "#F8F4E6",       // Shironeri
      highlight: "#D93B5F"   // Benikaba
    }
  },
  ukiyo: {
    name: "Ukiyo-e",
    colors: {
      background: "#F0E5D8", // Washi
      primary: "#2C5F2D",    // Aotake
      secondary: "#9B7FBD",  // Kikyou
      text: "#6B4C3A",       // Kogecha
      highlight: "#E09E47"   // Kohaku
    }
  },
  wabi: {
    name: "Wabi-Sabi",
    colors: {
      background: "#EEE6DE", // Kaminando
      primary: "#A8D8B9",    // Wakaba
      secondary: "#D9CBA3",  // Usuzumi
      text: "#4E4A41",       // Kurocha
      highlight: "#CA6924"   // Kohaku
    }
  },
  edo: {
    name: "Edo Night",
    colors: {
      background: "#1B1B1B", // Kuro
      primary: "#E60033",    // Aka
      secondary: "#9B7FBD",  // Kikyou
      text: "#E8D3A8",       // Ginshu
      highlight: "#D93B5F"   // Benikaba
    }
  }
} as const

export type ThemeKey = keyof typeof themes
