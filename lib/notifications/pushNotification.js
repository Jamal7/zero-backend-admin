const { Expo } = require('expo-server-sdk');

const expo = new Expo();

const sendPushNotification = async (pushToken, message) => {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    const messages = [];
    messages.push({
        to: pushToken,
        sound: 'default',
        title: 'New Message',
        body: message,
        data: { withSome: 'data' },
    });

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
};

module.exports = { sendPushNotification };
