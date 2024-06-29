const amqp = require("amqplib");

const smsNotification = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const queue = await channel.assertQueue("", { exclusive: true });
        console.log("Waiting for msgs => ", queue);

        await channel.bindQueue(queue.queue, exchange, "");

        channel.consume(queue.queue, (msg) => {
            if (msg !== null) {
                const product = JSON.parse(msg.content.toString());
                console.log("Sending SMS notification for product => ", product.name);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
};

smsNotification();
