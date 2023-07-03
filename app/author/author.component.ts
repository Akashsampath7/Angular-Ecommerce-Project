import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent {

  adminPhotoUrl: SafeResourceUrl;
  role: 'admin';
  email: 'admin@gmial.com';
  mobile:'8976859678';

  constructor(private apiService: ApiService, private router: Router, private sanitizer: DomSanitizer) {
    const imagePath = 'assets/user.png';
    this.adminPhotoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  }
 
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  ngOnInit() {
    if (!this.apiService.isAuthenticated() || !this.apiService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }
}
