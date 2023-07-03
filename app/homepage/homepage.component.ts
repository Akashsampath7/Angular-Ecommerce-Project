import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{
  adminPhotoUrl: SafeResourceUrl;

  constructor(private router: Router, private sanitizer: DomSanitizer) {
    const imagePath = 'assets/lecture-college_1098-16260.png';
    this.adminPhotoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  ngOnInit() {
  }
}
