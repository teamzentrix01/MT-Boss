const colorToken = (name) => `var(--${name})`;

const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: { 100: colorToken("brand-100"), 600: colorToken("brand-600"), 700: colorToken("brand-700") },
        ink: { 400: colorToken("ink-400"), 500: colorToken("ink-500"), 700: colorToken("ink-700"), 900: colorToken("ink-900") },
        line: colorToken("line"),
        app: colorToken("bg-app"),
        surface: colorToken("bg-surface"),
        success: { DEFAULT: colorToken("status-success"), soft: colorToken("status-success-bg") },
        warning: { DEFAULT: colorToken("status-warning"), soft: colorToken("status-warning-bg") },
        info: { DEFAULT: colorToken("status-info"), soft: colorToken("status-info-bg") },
        danger: { DEFAULT: colorToken("status-danger"), soft: colorToken("status-danger-bg") },
        accent: { DEFAULT: colorToken("status-accent"), soft: colorToken("status-accent-bg") },
      },
      fontFamily: {
        adminHeading: [colorToken("font-admin-heading")],
        adminBody: [colorToken("font-admin-body")],
      },
    },
  },
};

export default tailwindConfig;