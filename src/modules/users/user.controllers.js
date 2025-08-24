const userService = require('./user.services.js')

const createUser = async (req, res) => {
    const data = req.body
    user = userService.create(data)

    return res.status(201).json({
        status: "CREATED",
        data: user
    })
}

const getUsers = async (req, res) => {
    users = await userService.getAll()

    return res.status(200).json(users)
}

const getUserById = async (req, res) => {
    const id = req.params.id
    const user = await userService.getById(id)

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            status: "INVALID",
            message: "invalid user id"
        })
    }

    if (!user) {
        return res.status(404).json({
            status: "NOT FOUND",
            message: "user was not found"
        })
    }

    return res.status(200).json({ user })
}

const updateUser = async (req, res) => {
    const id = req.params.id
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            status: "INVALID",
            message: "invalid user id"
        })
    }
    const data = req.body

    const newUser = await userService.update(id, data)

    if (!newUser) {
        return res.status(401).json({
            status: "NOT FOUND",
            message: "user was not found"
        })
    }

    return res.status(200).json({
        status: "UPDATED",
        user: newUser
    })
}

const removeUser = async (req, res) => {
    const id = req.params.id

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            status: "INVALID",
            message: "invalid user id"
        })
    }

    removed = await userService.remove(id)
    if (!removed) {
        return res.status(404).json({
            status: "NOT FOUND",
            message: "user was not found"
        })
    }

    return res.status(200).end()
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    removeUser
}