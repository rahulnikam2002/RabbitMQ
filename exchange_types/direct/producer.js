const amqp = require("amqplib");

async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "mail_exchange";
        const routingKeyForSubUser = "send_mail_to_subscribed_users";
        const routingKeyForNormalUser = "send_mail_to_users";

        const message = {
            to: "normalUser@gmail.com",
            from: "harish@gmail.com",
            subject: "Thank you!!",
            body: "Hello ABC!!"
        };

        await channel.assertExchange(exchange, "direct", { durable: false });

        await channel.assertQueue("subscribed_users_mail_queue", { durable: false });
        await channel.assertQueue("users_mail_queue", { durable: false });

        await channel.bindQueue("subscribed_users_mail_queue", exchange, routingKeyForSubUser);
        await channel.bindQueue("users_mail_queue", exchange, routingKeyForNormalUser);

        channel.publish(exchange, routingKeyForNormalUser, Buffer.from(JSON.stringify(message)));
        console.log("Mail data was sent", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log(error);
    }
}

sendMail();
