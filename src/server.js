const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

async function main() {
  // Run migration deploy before server starts
  await prisma.$executeRawUnsafe(`SELECT 1`);
  console.log("Database connected, checking migrations...");

  const { exec } = require('child_process');
  exec('npx prisma migrate deploy', (err, stdout, stderr) => {
    if (err) {
      console.error('Migration error:', stderr);
      process.exit(1);
    }
    console.log('Migration complete:\n', stdout);

    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  });
}

main().catch((err) => {
  console.error('Startup error:', err);
});
