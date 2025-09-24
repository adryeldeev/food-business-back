const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Criar categorias
  await prisma.categoria.createMany({
    data: [
      { id: 1, nome: "Entradas" },
      { id: 2, nome: "Pratos Principais" },
      { id: 3, nome: "Sobremesas" },
      { id: 4, nome: "Bebidas" }
    ],
    skipDuplicates: true
  })

  // Criar itens do cardápio
  await prisma.foodItem.createMany({
    data: [
      { id: 1, nome: "Bruschetta", descricao: "Pão italiano torrado com tomate, manjericão e azeite", preco: 15.00, categoriaId: 1 },
      { id: 2, nome: "Filé à Parmegiana", descricao: "Filé empanado com queijo e molho de tomate, acompanha arroz e fritas", preco: 45.00, categoriaId: 2 },
      { id: 3, nome: "Risoto de Cogumelos", descricao: "Arroz arbóreo cremoso com mix de cogumelos frescos", preco: 38.00, categoriaId: 2 },
      { id: 4, nome: "Petit Gateau", descricao: "Bolo de chocolate com recheio cremoso e sorvete de creme", preco: 22.00, categoriaId: 3 },
      { id: 5, nome: "Suco Natural", descricao: "Sabores disponíveis: laranja, limão, abacaxi, maracujá", preco: 9.00, categoriaId: 4 }
    ],
    skipDuplicates: true
  })

  console.log("🌱 Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
