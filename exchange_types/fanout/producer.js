const amqp = require("amqplib");

const announceNewProduct = async (product) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const message = JSON.stringify(product);

        channel.publish(exchange, "", Buffer.from(message), { persistent: true });
        console.log(" Sent => ", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error("Error:", error);
    }
};

announceNewProduct({ id: 123, name: "iPhone 19 Pro Max", price: 200000 });
