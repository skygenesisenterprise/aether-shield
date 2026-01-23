import path from "path";
import fs from "fs";

// Load .env file manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^"|"$/g, "");
    }
  });
}

const config = {
  schema: path.resolve(process.cwd(), "schema.prisma"),
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;
