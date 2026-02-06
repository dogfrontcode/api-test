import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.requestLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.merchantConfig.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // Hash das senhas
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      balance: 1000.0
    }
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar usuário comum
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      balance: 100.0
    }
  });

  console.log('✅ User criado:', user.email);

  // Criar configuração de merchant para ambos
  await prisma.merchantConfig.create({
    data: {
      userId: admin.id,
      callbackUrl: 'https://admin-webhook.example.com/callback'
    }
  });

  await prisma.merchantConfig.create({
    data: {
      userId: user.id,
      callbackUrl: 'https://user-webhook.example.com/callback'
    }
  });

  console.log('✅ Configurações de merchant criadas');

  console.log('\n📊 Resumo:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:');
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: admin123`);
  console.log(`  Role:     ${admin.role}`);
  console.log(`  Balance:  R$ ${admin.balance.toFixed(2)}`);
  console.log('');
  console.log('User:');
  console.log(`  Email:    ${user.email}`);
  console.log(`  Password: user123`);
  console.log(`  Role:     ${user.role}`);
  console.log(`  Balance:  R$ ${user.balance.toFixed(2)}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

