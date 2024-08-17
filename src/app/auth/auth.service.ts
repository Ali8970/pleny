import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.base_url}auth`;
  private loggedInStatus = new BehaviorSubject<boolean>(false); // Tracks the user's login status
  private refreshTokenTimeout: any; // Stores the timeout reference for the token refresh

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Returns an observable that emits the current login status.
   */
  get isLoggedIn(): Observable<boolean> {
    return this.loggedInStatus.asObservable();
  }

  /**
   * Updates the login status and emits the new status.
   * @param status - A boolean indicating the user's login status.
   */
  setLoginStatus(status: boolean): void {
    this.loggedInStatus.next(status);
  }

  /**
   * Sends a login request to the server with the user's credentials.
   * If successful, stores the tokens, sets the login status to true,
   * and schedules a token refresh.
   * @param credentials - An object containing the user's email and password.
   * @returns An observable of the server's response.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: User) => {
        this.router.navigate(['./view/products']);
        this.setInLocalStorage(
          response.token,
          response.refreshToken,
          response.id
        ); // Store the tokens locally
        this.setLoginStatus(true); // Set login status to true
        this.scheduleRefreshToken(30 * 60); // Schedule token refresh in 30 minutes
      })
    );
  }

  /**
   * Stores the token and refresh token and userId in localStorage.
   * @param token - The authentication token.
   * @param refreshToken - The refresh token.
   * @param userId - The userId.
   */
  private setInLocalStorage(
    token: string,
    refreshToken: string,
    id: number
  ): void {
    localStorage.setItem('token', token); // Store the token in localStorage
    localStorage.setItem('refreshToken', refreshToken); // Store the refresh token in localStorage
    localStorage.setItem('userId', id.toString()); // Store the userId in localStorage
  }

  /**
   * Retrieves the refresh token from localStorage.
   * @returns The refresh token or null if not found.
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Retrieves the authentication token from localStorage.
   * @returns The authentication token or null if not found.
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Logs the user out by clearing the tokens,
   * setting the login status to false, and clearing the refresh token timeout.
   */
  logout(): void {
    this.clearTokens(); // Clear tokens from localStorage
    this.setLoginStatus(false); // Set login status to false
    clearTimeout(this.refreshTokenTimeout); // Clear the token refresh timeout
    this.router.navigate(['./auth/login']);
    this.setLoginStatus(true);
  }

  /**
   * Clears the authentication token and refresh token from localStorage.
   */
  private clearTokens(): void {
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('refreshToken'); // Remove the refresh token from localStorage
  }

  /**
   * Sends a request to refresh the authentication token using the refresh token.
   * If successful, stores the new tokens and schedules the next refresh.
   * If an error occurs, logs the user out.
   * @returns An observable of the server's response.
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    return this.http
      .post<User>(`${this.baseUrl}/refresh`, {
        refreshToken: refreshToken,
        expiresInMins: 30, // Request a token with a 30-minute expiration
      })
      .pipe(
        tap((response: User) => {
          this.setInLocalStorage(
            response.token,
            response.refreshToken,
            response.id
          ); // Store the new tokens
          this.scheduleRefreshToken(30 * 60); // Schedule the next refresh
        }),
        catchError((error) => {
          this.logout(); // Log the user out on error
          throw error;
        })
      );
  }

  /**
   * Schedules a token refresh before the current token expires.
   * @param expiresInSeconds - The number of seconds until the token expires.
   */
  private scheduleRefreshToken(expiresInSeconds: number): void {
    const delay = (expiresInSeconds - 60) * 1000; // Refresh 1 minute before expiry
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe(); // Call the refreshToken method
    }, delay);
  }

  /**
   * Automatically logs the user in if a token is found in localStorage.
   * Also schedules a token refresh based on the assumed token expiry time.
   */
  autoLogin(): void {
    const token = this.getToken();
    if (token) {
      this.setLoginStatus(true); // Set login status to true if a token is found
      const expiresInSeconds = 1800; // Assuming a 30-minute expiry
      this.scheduleRefreshToken(expiresInSeconds); // Schedule a token refresh
    }
  }
}
