import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { User } from "./user";
import { environment } from "../../environments/environment";
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';
import { DebuggingService } from '../debugger/debugging.service';
import { PositionService } from '../core/position.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from '../core/socket.service';

@Injectable()
export class UserService {
  private token: string;
  private headers: Headers;
  private requestOptions: RequestOptions;
  public userPromise: Promise<any>;
  public user$: BehaviorSubject<User> = new BehaviorSubject(null);

  private userSub: Subscription;
  private positionSub: Subscription;

  private socket: Socket;

  constructor(private http: Http,
              private socketService: SocketService,
              private positionService: PositionService,
              private rideSubjectService: RideSubjectService) {
    this.getRideFromStorage();
    // this.makeUserPromise();
    this.watchWhenToJoinRide();
    this.watchWhenToUpdateUserPosition();
    this.socket = this.socketService.socket;
  }

  getRideFromStorage() {
    let ride = environment.storage.getItem('rpRide');  // This may or may not exist.
    if ( ride ) this.rideSubjectService.ride$.next(ride);
  }

  // makeUserPromise() {
  //   if (this.userSub) this.userSub.unsubscribe();
  //
  //   this.userPromise = new Promise((resolve, reject) => {
  //     this.userSub = this.user$.subscribe(user => {
  //       if ( user ) resolve(user)
  //     });
  //   });
  // }

  getUserPromise() {
    let userPromise = new Promise((resolve, reject) => {
      let userSub = this.user$.subscribe(user => {
        if ( user ) {
          resolve(user);
          userSub.unsubscribe();
        }
      })
    });

    return userPromise;
  }

  watchWhenToUpdateUserPosition() {
    if (this.positionSub) this.positionSub.unsubscribe();

    this.getUserPromise().then((user: User) => {
      this.positionSub = this.positionService.position$.subscribe(position => {
        if (position) {
          user.position = JSON.parse(JSON.stringify(position));
          this.user$.next(user);
          if ( user.ride ) this.socket.emit('updateUserPosition', user.position);
        }
      });
    });
  }

  watchWhenToJoinRide() {
    Promise.all([ this.getUserPromise(), this.rideSubjectService.getRidePromise(), this.positionService.positionPromise ])
        .then(userAndRide => {
          // Todo: Can I be sure that he app has had time to set user.position, just because user and position exist?
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
