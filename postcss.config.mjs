const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-import": {},
    "postcss-nesting": {},
    "postcss-preset-env": {
      stage: 3,
      features: {
        "nesting-rules": true,
        "custom-media-queries": true,
        "media-query-ranges": true,
        "custom-properties": true,
        "color-mix": true,
        "logical-properties-and-values": true,
      },
    },
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};

export default config;
