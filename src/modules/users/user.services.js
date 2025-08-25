
let userList = [
    {
        id: 1,
        nome: "João Silva",
        email: "joao.silva@example.com",
        password: "senha123",
        user_type: "admin",
        phone: "+55 11 91234-5678",
        photo_url: "https://example.com/photos/joao_silva.jpg",
        created_at: "2025-08-01T10:15:00Z",
        updated_at: "2025-08-15T08:45:00Z",
        deleted_at: null
    },
    {
        id: 2,
        nome: "Maria Oliveira",
        email: "maria.oliveira@example.com",
        password: "senha456",
        user_type: "user",
        phone: "+55 21 99876-5432",
        photo_url: "https://example.com/photos/maria_oliveira.jpg",
        created_at: "2025-08-05T14:30:00Z",
        updated_at: "2025-08-20T09:10:00Z",
        deleted_at: "2025-08-22T17:00:00Z"
    }]
let nextId = 3;

const create = async (data) => {
    const now = new Date().toISOString()

    const user = {
      id: nextId++,
      ...data,
      created_at: now,
      updated_at: now,
      deleted_at: null
    }

    userList.push(user)
    return user
}

const getAll = async () => {
    return userList
}

const getById = async (id) => {
    return userList.find(user => user.id == id)
}

const update = async (id, data) => {
    const index = userList.findIndex(user => user.id == id);

    if (index === -1) {
        return false
    }

    userList[index] = {
        ...userList[index],
        ...data,
        updated_at: new Date().toISOString()
    };

    return userList[index];
}

const remove = async (id) => {
    const index = userList.findIndex(user => user.id == id)
    if (index === -1) {
        return false
    }

    userList.splice(index, 1)

    return true
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
}