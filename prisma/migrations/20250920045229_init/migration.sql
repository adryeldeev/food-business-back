-- CreateEnum
CREATE TYPE "public"."FormaPagamento" AS ENUM ('DINHEIRO', 'CARTAO', 'PIX', 'VALE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entregador" (
    "id" SERIAL NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "veiculo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entregador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Endereco" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "complemento" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pedido" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "formaPagamento" "public"."FormaPagamento" NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItensPedido" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "foodItemId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItensPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FoodItem" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entregador_userId_key" ON "public"."Entregador"("userId");

-- AddForeignKey
ALTER TABLE "public"."Entregador" ADD CONSTRAINT "Entregador_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Endereco" ADD CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "public"."Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItensPedido" ADD CONSTRAINT "ItensPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItensPedido" ADD CONSTRAINT "ItensPedido_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "public"."FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FoodItem" ADD CONSTRAINT "FoodItem_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
