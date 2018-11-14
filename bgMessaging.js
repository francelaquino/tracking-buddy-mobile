import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';


export default async (notification: RemoteMessage) => {
    // handle your message

    const channel = new firebase.notifications.Android.Channel('My GPS Buddy', 'My GPS Buddy', firebase.notifications.Android.Importance.Max)
        .setDescription('My GPS Buddy');

    firebase.notifications().android.createChannel(channel);

    const notificationMessage = new firebase.notifications.Notification()
        .setNotificationId(notification.messageId)
        .setTitle(notification.data.title)
        .setBody(notification.data.body)
        .android.setPriority(firebase.notifications.Android.Priority.Max)
        .android.setChannelId('My GPS Buddy');

    firebase.notifications().displayNotification(notificationMessage);

    setInterval(async function myTimer() {
        console.log("1");
     }, 6000);

    return Promise.resolve();
}