import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'pleny';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.autoLogin();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['./auth/login']);
    }
  }
}
