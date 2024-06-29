const amqp = require("amqplib");

const consumeLiveStreamNotifications = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const q = await channel.assertQueue("", { exclusive: true });
        console.log("Waiting for live stream notifications");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "all",
            "notification-type": "live_stream",
            "content-type": "gaming"
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log("Received live stream notification", message);
                // Process the notification
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
};

consumeLiveStreamNotifications();
