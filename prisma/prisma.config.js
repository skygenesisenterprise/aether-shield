module.exports = {
  schema: "./schema.prisma",
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
