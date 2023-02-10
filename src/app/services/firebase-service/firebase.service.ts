import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, Subscription } from 'rxjs'
import { map } from 'rxjs/operators';
//import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
//import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public subscriptions: Array<Subscription>=[];
  constructor(
    //private fcm: FCM,
    private fireStore: AngularFirestore,
    //private uniqueDeviceID: UniqueDeviceID
  ) { }

  /** Function is used to handle firebase crud
   * @param  {string} collectionName
   * @param  {any} params
   * @param  {string} serviceAction
   */
  public firebaseHandler(collectionName: string, params: any, serviceAction: string) {
    if (serviceAction == 'save') {
      return Observable.create(observer => {
        this.fireStore.collection(collectionName).add(params)
          .then((docRef) => {
            observer.next({ doc_id: docRef.id });
            observer.complete();
          }, (err) => {
            observer.error(err);
          });
      });

    } else if (serviceAction == 'update') {
      let collectionRef: any = this.fireStore.collection(collectionName);
      return Observable.create(observer => {
        collectionRef.get().subscribe((querySnapshot) => {
          let i = 0;
          querySnapshot.forEach(function (doc: any) {
            i++;
            if (i == 1) {
              let updateDoc: any = collectionRef.doc(doc.id);
              updateDoc.update(params)
                .then((data) => {
                  observer.next({ updated: true });
                  observer.complete();
                }, (err) => {
                  observer.error(err);
                });
            }
          });
        });
      })
    } else if (serviceAction == 'just_fetch') {
      return this.fireStore
        .collection(collectionName, ref => ref
          .where(
            params.fieldName
            , params.oparator
            , params.fieldVal
          )
          .orderBy(
            params.orderBy
            , params.whichOrder
          )
        ).valueChanges();
    } else if (serviceAction == 'single_message') {
      const ref1 = this.fireStore.collection(collectionName, ref => ref
        .where("receiver_id", params.oparator, params.sender_id)
        .where("sender_id", params.oparator, params.receiver_id));
      const ref2 = this.fireStore.collection(collectionName, ref => ref
        .where("receiver_id", params.oparator, params.receiver_id)
        .where("sender_id", params.oparator, params.sender_id));
      return combineLatest(ref1.valueChanges(), ref2.valueChanges())
        .pipe(map(([one, two]) => one.concat(two)));

    } else if (serviceAction == 'all_single_message') {
      const ref1 = this.fireStore.collection(collectionName, ref => ref
        .where("receiver_id", params.oparator, params.sender_id));
      const ref2 = this.fireStore.collection(collectionName, ref => ref
        .where("sender_id", params.oparator, params.sender_id));
      return combineLatest(ref1.valueChanges(), ref2.valueChanges())
        .pipe(map(([one, two]) => one.concat(two)));

    } else {
      return Observable.create(observer => {
        observer.next({ error: 1 });
        observer.complete();
      });
    }
  }

  /** This fuction for get notification subscribe
   */
  public onNotifications() {
   // return this.fcm.onNotification();
  }

  /** This fuction for set notification token
   */
  public setToken() {
    // this.fcm.getToken().then(async notification_token => {
    //   await this.saveToken(notification_token);
    // }, err => { })
  }

  /** This fuction for save notification token
   * @param {string} notification_token 
   */
  public saveToken(notification_token) {
    localStorage.setItem('notification_token', notification_token);
  }

  /** This fuction for get notification token
   */
  public getToken(): any {
    return localStorage.getItem('notification_token');
  }

  /** This fuction for delete notification token
   */
  public deleteToken() {
    localStorage.removeItem('notification_token');
  }

  /** This fuction for refresh notification token
   */
  public onTokenRefresh() {
    // this.fcm.onTokenRefresh().subscribe(async notification_token => {
    //   await this.saveToken(notification_token);
    // }, err => { });
  }

  public subscribeToTopic() {
   // this.fcm.subscribeToTopic('Popping');
  }

  public unsubscribeFromTopic() {
   // this.fcm.unsubscribeFromTopic('Popping');
  }

  /** This fuction for save device type
  * @param {string} deviceType 
  */
  public setDeviceType(deviceType) {
    localStorage.setItem('deviceType', deviceType);
  }

  /** This fuction for get device type
   */
  getDeviceType(): any {
    return localStorage.getItem('deviceType');
  }

  /** This fuction for save device id
   */
  public setDeviceId() {
    // this.uniqueDeviceID.get()
    //   .then((uuid: any) => {
    //     localStorage.setItem('deviceId', uuid);
    //   })
    //   .catch((error: any) => {
    //   })
  }

  /** This fuction for get device id
   */
  public getDeviceId(): any {
    return localStorage.getItem('deviceId');
  }


  updateChat(collectionName: string, params: any, serviceAction: string) {
    console.log(params);
    return Observable.create(observer => {
      const doc = this.fireStore.collection(collectionName, ref => ref
        .where("receiver_id", params.oparator, params.receiver_id)
        .where("product_id", params.oparator, params.product_id));
      console.log(doc);
      this.subscriptions.push(doc.snapshotChanges().pipe(
        map(actions => actions.map((a: any) => {
          const data: {} = a.payload.doc.data();
          const id = a.payload.doc.id;
          this.fireStore.doc(collectionName + `/${id}`).update({ seen: true });
          return { id, ...data };
        }))).subscribe((_doc: any) => {
          console.log(_doc);
        }))
    });
  }

  unsubscribe(){
    this.subscriptions.forEach((subscription) => {
      console.log("subscription",subscription);
      subscription.unsubscribe();
    });
    
  }

  clearAllChatMessageByReceiverAndProductId(collectionName: string, params: any) {
    console.log(params);
    return Observable.create(observer => {
      const doc = this.fireStore.collection(collectionName, ref => ref
        .where("receiver_id", params.oparator, params.receiver_id)
        
        .where("product_id", params.oparator, params.product_id));
      console.log(doc);
      doc.snapshotChanges().pipe(
        map(actions => actions.map((a: any) => {
          const data: {} = a.payload.doc.data();
          const id = a.payload.doc.id;
          this.fireStore.doc(collectionName + `/${id}`).delete();
          return { id, ...data };
        }))).subscribe((_doc: any) => {
          console.log(_doc);
        })
    });
  }

  /* in future this function need to be impliment in server side */
  clearAllMessageOfBefore30Days(collectionName: string="trade_chats") {
    let today = new Date();
    today.setDate(today.getDate() - 30);

    return Observable.create(observer => {
      const doc = this.fireStore.collection(collectionName, ref => ref
        .where("created", "<=", today.getTime()));
      console.log(doc);
      doc.snapshotChanges().pipe(
        map(actions => actions.map((a: any) => {
          const data: {} = a.payload.doc.data();
          const id = a.payload.doc.id;
          //uncomment this line
         this.fireStore.doc(collectionName + `/${id}`).delete();
          return { id, ...data };
        }))).subscribe((_doc: any) => {
          console.log(_doc);
        })
    });
  }

}
