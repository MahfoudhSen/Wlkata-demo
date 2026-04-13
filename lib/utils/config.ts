export const config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: 'claude-3-5-sonnet-20241022',
  },

  robot: {
    defaultPort: process.env.ROBOT_DEFAULT_PORT || '/dev/ttyUSB0',
    baudRate: 115200,
    timeout: 5000,
  },

  database: {
    url: process.env.DATABASE_URL || '',
  },

  app: {
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },
};
