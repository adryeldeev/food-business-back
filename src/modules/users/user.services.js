const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const createUser = async (userData) => {
  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.senha, saltRounds);

    const user = await prisma.user.create({
      data: {
        nome: userData.nome,
        email: userData.email,
        senha: hashedPassword
      },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
    return user;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Email já está em uso');
    }
    throw new Error(`Erro ao criar usuário: ${error.message}`);
  }
};

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true
      },
      orderBy: {
        id: 'desc'
      }
    });
    return users;
  } catch (error) {
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
    return user;
  } catch (error) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true 
      }
    });
    return user;
  } catch (error) {
    throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
  }
};

const updateUser = async (userId, userData) => {
  try {
    let updateData = {
      nome: userData.nome,
      email: userData.email
    };

    if (userData.senha) {
      const saltRounds = 12;
      updateData.senha = await bcrypt.hash(userData.senha, saltRounds);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true
      }
    });
    return user;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Email já está em uso');
    }
    throw new Error(`Erro ao atualizar usuário: ${error.message}`);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) }
    });

    return true;
  } catch (error) {
    throw new Error(`Erro ao deletar usuário: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
};