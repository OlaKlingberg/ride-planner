import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent  {
  url: SafeResourceUrl;

  constructor(private router: Router,
              private sanitizer: DomSanitizer) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('map/iframe');
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
