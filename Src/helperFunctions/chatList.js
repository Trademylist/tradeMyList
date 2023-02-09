import firestore from '@react-native-firebase/firestore';;
import AsyncStorage from '@react-native-community/async-storage';

const ref = firestore().collection('Trade_Message');

export function chatList(onChatCounterUpdate) {
    //console.log('props', onChatCounterUpdate);
    return new Promise(async (resolve, reject) => {
        const value = JSON.parse(await AsyncStorage.getItem('UserData'));
        const currentUserId = value.userid;
        ref.where('receiver_id', '==', currentUserId).onSnapshot(async querySnapshot => {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'));
            if(value){
                let receivedQuery = await ref.where('receiver_id', '==', currentUserId).get();
                let headerChats = [];
                let newHeaders = [];
                let all = [];
                let unreadMessageCount = 0;
                receivedQuery.docs.map(doc => {
                    all.push(doc.data())
                })
                all = [...all].sort((a,b) => b.created - a.created);
                for (let i = 0; i < all.length; i++) {
                    let product_id = all[i].product_id;
                    if(newHeaders.length == 0){
                        newHeaders.push({product_id: all[i].product_id, data: [all[i]]});
                    } else {
                        let found = false;
                        for (let j = 0; j < newHeaders.length; j++) {
                            const headerElement = newHeaders[j];
                            if(headerElement.product_id == product_id){
                                found = true;
                                let unique = true;
                                for (let k = 0; k < headerElement.data.length; k++) {
                                    const element = headerElement.data[k];
                                    let idToBeCheckedIn = (currentUserId == element.sender_id) ? element.receiver_id: element.sender_id;
                                    let idToBeCheckedOut = (currentUserId == all[i].sender_id) ? all[i].receiver_id: all[i].sender_id;
                                    if(idToBeCheckedOut == idToBeCheckedIn){
                                        unique = false;
                                        break;
                                    }
                                }
                                if(unique){
                                    newHeaders[j].data.push(all[i]);
                                    break;
                                }
                            }
                        }
                        if(!found){
                            newHeaders.push({product_id: all[i].product_id, data: [all[i]]});
                        }
                    }
                }
                for (let i = 0; i < newHeaders.length; i++) {
                    let main = newHeaders[i];
                    for (let j = 0; j < main.data.length; j++) {
                        let sub = main.data[j];
                        headerChats.push(sub);
                        if(!sub.seen){
                            ++unreadMessageCount;
                        }
                    }
                }
                if(onChatCounterUpdate){
                    onChatCounterUpdate(unreadMessageCount);
                }
                resolve(unreadMessageCount);
            }  else {
                if(onChatCounterUpdate){
                    onChatCounterUpdate(0);
                }
                resolve(0);
            }
        });
    })
}