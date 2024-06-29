const amqp = require("amqplib");

const consumeNewVideoNotifications = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const q = await channel.assertQueue("", { exclusive: true });
        console.log("Waiting for new video notifications");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "all",
            "notification-type": "new_video",
            "content-type": "video"
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log("Received new video notification", message);
                // Notification code yaha pr ayega!
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
};

consumeNewVideoNotifications();
