import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../user/user';
import { SocketService } from '../core/socket.service';
import Socket = SocketIOClient.Socket;

@Injectable()
export class RiderService {
  riderList$: BehaviorSubject<Array<User>> = new BehaviorSubject(null);

  private socket: Socket;
  private zCounter: number = 0;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
    this.onDisconnectedRider();
    this.onJoinedRider();
    this.onRemovedRider();
    this.onRiderList();
    this.onUpdatedRiderPosition();
  }

  onDisconnectedRider() {
    this.socket.on('disconnectedRider', disconnectedRider => {
      console.log('disconnectedRider');
      this.riderListPromise().then((riderList: Array<User>) => {
        let idx = _.findIndex(riderList, rider => rider._id === disconnectedRider._id);
        if ( idx >= 0) {
          riderList[ idx ].disconnected = disconnectedRider.disconnected;
          this.riderList$.next(riderList);
        }
      });
    });
  }

  onJoinedRider() {
    this.socket.on('joinedRider', joinedRider => {
      console.log('joinedRider:', joinedRider.fname, joinedRider.lname);
      // If the zIndices are getting too high, it's time to request the whole riderList again.
      if ( this.zCounter >= 1000 ) {
        this.zCounter = 0;
        console.log("Counter reached 1000! About to emit giveMeRiderList.");
        this.socket.emit('giveMeRiderList', this.user.ride);
      } else {
        if ( joinedRider._id !== this.user._id ) {
          joinedRider = new User(joinedRider);
          joinedRider.zIndex = this.zCounter++;
          if ( joinedRider.leader ) joinedRider.zIndex += 500;
          this.riderListPromise().then((riderList: Array<User>) => {
            // console.log("riderList before adding the joined rider:", riderList);
            riderList = riderList.filter(rider => rider._id !== joinedRider._id);
            riderList.push(joinedRider);
            // console.log("Updated riderList:", riderList);
            this.riderList$.next(riderList);
          });
        }
      }
    });
  }

  onRemovedRider() {
    this.socket.on('removedRider', _id => {
      console.log('removedRider');
      let riders = this.riderList$.value.filter(rider => rider._id !== _id);

      this.riderList$.next(riders);
    });
  }

  onRiderList() {
    this.socket.on('riderList', riderList => {
      riderList = riderList.map(rider => new User(rider));
      this.riderList$.next(riderList);
    });
  }

  onUpdatedRiderPosition() {
    this.socket.on('updatedRiderPosition', updatedRider => {
      let riderList = this.riderList$.value;
      let idx = _.findIndex(riderList, rider => rider._id === updatedRider._id);
      if ( idx >= 0 ) {
        riderList[ idx ].position.timestamp = updatedRider.position.timestamp;
        riderList[ idx ].position.coords.accuracy = updatedRider.position.coords.accuracy;
        riderList[ idx ].position.coords.latitude = updatedRider.position.coords.latitude;
        riderList[ idx ].position.coords.longitude = updatedRider.position.coords.longitude;

        this.riderList$.next(riderList);
      }
    });
  }

  riderListPromise() {
    let riderListPromise = new Promise((resolve, reject) => {
      let subscription = this.riderList$.subscribe(riderList => {
        if ( riderList ) {
          resolve(riderList);
          subscription.unsubscribe();
        }
      })
    });

    return riderListPromise;
  }

}
