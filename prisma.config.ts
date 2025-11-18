import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load environment variables from .env file
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:waka123@localhost:5432/e-kunde-api?schema=public',
  },
});
