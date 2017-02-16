import { Component, OnInit } from '@angular/core';
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Sec7NodeApiCallService } from "./sec7-node-api-call.service";

@Component({
  selector: 'app-sec7-node-api-call',
  templateUrl: './sec7-node-api-call.component.html',
  styleUrls: ['./sec7-node-api-call.component.scss']
})
export class Sec7NodeApiCallComponent implements OnInit {
  buttonClicked: boolean = false;
  x: string = "This is x.";
  todo: string = "This is where the todo will be shown.";

  constructor(private http: Http, private sec7NodeApiCallService: Sec7NodeApiCallService) {}

  makeSomeChanges() {
    this.buttonClicked = true;
    this.x = "This is still x, but with a new value.";

    this.sec7NodeApiCallService.getTodos()
        .subscribe(data => {
          this.todo = data.todos[1].text;
        },
        error => {
          console.log(error);
        });




  }



  ngOnInit() {
  }

}
