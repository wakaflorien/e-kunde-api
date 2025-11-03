export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  port: parseInt(process.env.PORT || '3000', 10),
});
