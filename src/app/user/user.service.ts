import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { User } from "./user";
import { environment } from "../../environments/environment";
import Socket = SocketIOClient.Socket;
import { MiscService } from '../core/misc.service';
import { Subscription } from 'rxjs/Subscription';
import { DebuggingService } from '../debugger/debugging.service';
import { PositionService } from '../core/position.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RideSubjectService } from '../ride/ride-subject.service';

@Injectable()
export class UserService {
  private token: string;
  private headers: Headers;
  private requestOptions: RequestOptions;
  public userPromise: Promise<any>;

  public user$: BehaviorSubject<User> = new BehaviorSubject(null);

  private userSub: Subscription;
  private rideSub: Subscription;
  private positionSub: Subscription;

  private socket: Socket;

  constructor(private http: Http,
              private miscService: MiscService,
              private positionService: PositionService,
              private rideSubjectService: RideSubjectService) {
    this.getRideFromStorage();
    this.makeUserPromise();
    this.watchWhenToJoinRide();
    this.watchWhenToUpdateUserPosition();
    this.socket = this.miscService.socket;
  }

  getRideFromStorage() {
    let ride = environment.storage.getItem('rpRide');  // This may or may not exist.
    if ( ride ) this.rideSubjectService.ride$.next(ride);
  }

  makeUserPromise() {
    this.userPromise = new Promise((resolve, reject) => {
      this.user$.subscribe(user => {
        if ( user ) resolve(user)
      });
    });
  }

  watchWhenToUpdateUserPosition() {
    if (this.positionSub) this.positionSub.unsubscribe();

    // Wait till we have a user and then subscribe to position$
    this.userPromise.then((user: User) => {
      this.positionSub = this.positionService.position$.subscribe(position => {
        if (position) {
          // Todo: Can I refactor this using JSON.stringify and JSON.parse?
          user.position = {
            coords: {
              accuracy: position.coords.accuracy,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            timestamp: position.timestamp
          };
          this.user$.next(user);
          if ( user.ride ) this.socket.emit('updateUserPosition', user.position);
        }
      });
    });
  }

  watchWhenToJoinRide() {
    // Todo: Can I just use the postionPromise instead? Would I have to wait a tick?
    // Wait till we have a user.position ...
    let userPositionPromise = new Promise((resolve, reject) => {
      this.userSub = this.user$.subscribe(user => {
        if ( user && user.position.coords.latitude ) resolve(user)
      });
    });

    // Todo: Put this in RideService.
    // ... and a ride selection ...
    let ridePromise = new Promise((resolve, reject) => {
      this.rideSub = this.rideSubjectService.ride$.subscribe(ride => {
        if ( ride ) resolve(ride);
      });
    });

    // .. and then emit joinRide.
    Promise.all([ userPositionPromise, ridePromise ])
        .then(userAndRide => {
          this.userSub.unsubscribe();
          this.rideSub.unsubscribe();
          let user: any = userAndRide[ 0 ];
          let ride: any = userAndRide[ 1 ];
          let token = JSON.parse(environment.storage.getItem('rpToken'));

          this.socket.emit('joinRide', user, ride, token, () => {
            user.ride = ride;
            this.user$.next(user);
          });
        });
  }

  create(user: User) {
    user.email = user.email.toLowerCase();

    return this.http.post(`${environment.api}/users`, user);
  }

  getAllUsers() {
    this.token = JSON.parse(environment.storage.getItem('rpToken'));
    this.headers = new Headers({ 'x-auth': this.token });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users`, this.requestOptions);
  }

}
