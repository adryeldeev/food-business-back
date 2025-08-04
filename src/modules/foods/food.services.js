const foodData = [
    {
    id: 1,
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela fresca, manjericão e azeite",
    price: 45.90,
    image_url: "https://example.com/pizza-margherita.jpg",
    category: "pizza"
  },
  {
    id: 2,
    name: "Pizza Pepperoni",
    description: "Molho de tomate, mussarela e pepperoni picante",
    price: 52.50,
    image_url: "https://example.com/pizza-pepperoni.jpg",
    category: "pizza"
  },
  {
    id: 3,
    name: "Cheeseburger Clássico",
    description: "Pão brioche, hambúrguer 180g, queijo cheddar e molho especial",
    price: 24.00,
    image_url: "https://example.com/cheeseburger.jpg",
    category: "hamburger"
  },
  {
    id: 4,
    name: "Burger Bacon",
    description: "Hambúrguer 200g, bacon crocante, cebola caramelizada e molho barbecue",
    price: 28.75,
    image_url: "https://example.com/burger-bacon.jpg",
    category: "hamburger"
  },
  {
    id: 5,
    name: "Spaghetti Carbonara",
    description: "Espaguete com molho cremoso de bacon, ovos e queijo pecorino",
    price: 32.80,
    image_url: "https://example.com/spaghetti-carbonara.jpg",
    category: "pasta"
  },
  {
    id: 6,
    name: "Coca-Cola",
    description: "Lata 350ml gelada",
    price: 6.50,
    image_url: "https://example.com/coca-cola.jpg",
    category: "drink"
  },
  {
    id: 7,
    name: "Suco de Laranja Natural",
    description: "500ml, feito na hora",
    price: 10.00,
    image_url: "https://example.com/suco-laranja.jpg",
    category: "drink"
  }
]

const create = () => {
    return "food created successfuly"
}

const getAll = () => {
    return foodData
}

const getById = (id) => {
    return foodData[0]
}

const getByCategory = (category) => {
    return foodData[0]
}

const update = (id, data) => {
    return foodData[0]
}

const exclude = (id) => {
    return "food deleted successfuly"
}

module.exports = {
    create,
    getAll,
    getById,
    getByCategory,
    update,
    exclude
}