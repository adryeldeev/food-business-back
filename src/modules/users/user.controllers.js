const userService = require('./user.services.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../middlewares/auth');

const createUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    const user = await userService.createUser({ nome, email, senha });
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    if (error.message.includes('Email já está em uso')) {
      return res.status(409).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        nome: user.nome 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { senha: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: token
      },
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar login'
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      message: 'Usuários encontrados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Usuário encontrado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nome e email são obrigatórios'
      });
    }

    const user = await userService.updateUser(req.params.id, { nome, email, senha });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Usuário atualizado com sucesso'
    });
  } catch (error) {
    if (error.message.includes('Email já está em uso')) {
      return res.status(409).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login
};