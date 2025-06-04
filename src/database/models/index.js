const { Sequelize } = require("sequelize");
const { [process.env.NODE_ENV]: config } = require("../config.cjs");

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    dialectModule: require("mysql2"),
    logging: false,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

const User = require("./user")(sequelize, Sequelize.DataTypes);
const Role = require("./role")(sequelize, Sequelize.DataTypes);
const Product = require("./product")(sequelize, Sequelize.DataTypes);
const Media = require("./media")(sequelize, Sequelize.DataTypes);
const ProductCategory = require("./productcategory")(sequelize, Sequelize.DataTypes);
const ProductSize = require("./productsize")(sequelize, Sequelize.DataTypes);
const Size = require("./size")(sequelize, Sequelize.DataTypes);
const Category = require("./category")(sequelize, Sequelize.DataTypes);
const Order = require("./order")(sequelize, Sequelize.DataTypes);
const OrderProduct = require("./orderproduct")(sequelize, Sequelize.DataTypes);
const ShippingHistory = require("./shippinghistory")(sequelize, Sequelize.DataTypes);
const PaymentDetail = require("./paymentdetail")(sequelize, Sequelize.DataTypes);
const ShippingDetail = require("./shippingdetail")(sequelize, Sequelize.DataTypes);
const Cart = require("./cart")(sequelize, Sequelize.DataTypes);

Role.hasMany(User, { foreignKey: "role_id", as: "users" });
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

Product.hasMany(Media, { foreignKey: "product_id", as: "medias" });
Media.belongsTo(Product, { foreignKey: "product_id", as: "product" });

Product.belongsToMany(Category, {
    through: ProductCategory,
    foreignKey: "product_id",
    as: "categories",
});
Category.belongsToMany(Product, {
    through: ProductCategory,
    foreignKey: "category_id",
    as: "products",
});

Product.belongsToMany(Size, { through: ProductSize, foreignKey: "product_id", as: "sizes" });
Size.belongsToMany(Product, { through: ProductSize, foreignKey: "size_id", as: "products" });

Product.hasMany(OrderProduct, { foreignKey: "product_id", as: "orders" });
OrderProduct.belongsTo(Product, { foreignKey: "product_id", as: "product" });

Size.hasMany(OrderProduct, { foreignKey: "size_id", as: "orders" });
OrderProduct.belongsTo(Size, { foreignKey: "size_id", as: "size" });

Product.hasMany(Cart, { foreignKey: "product_id", as: "carts" });
Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

User.hasMany(Cart, { foreignKey: "user_id", as: "carts" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });

Size.hasMany(Cart, { foreignKey: "size_id", as: "carts" });
Cart.belongsTo(Size, { foreignKey: "size_id", as: "size" });

User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

Order.hasMany(OrderProduct, { foreignKey: "order_id", as: "products" });
OrderProduct.belongsTo(Order, { foreignKey: "order_id", as: "order" });

Order.hasOne(ShippingDetail, { foreignKey: "order_id", as: "shipping" });
ShippingDetail.belongsTo(Order, { foreignKey: "order_id", as: "order" });

Order.hasOne(PaymentDetail, { foreignKey: "order_id", as: "payment" });
PaymentDetail.belongsTo(Order, { foreignKey: "order_id", as: "order" });

ShippingDetail.hasMany(ShippingHistory, { foreignKey: "shipping_id", as: "histories" });
ShippingHistory.belongsTo(ShippingDetail, { foreignKey: "shipping_id", as: "shipping" });

module.exports = {
    sequelize,
    User,
    Product,
    Media,
    Size,
    Role,
    Category,
    Order,
    OrderProduct,
    ShippingHistory,
    PaymentDetail,
    ShippingDetail,
    ProductCategory,
    ProductSize,
    Cart,
};
