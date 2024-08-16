import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService {
  // Base URL for API requests, fetched from environment settings
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  /**
   * Sends a GET request to the specified API.
   * If both params and queryParams are absent, it returns the response data directly.
   * Otherwise, it handles the request based on the presence of params or queryParams.
   *
   * @param Api_Name - API endpoint to call.
   * @param params - (Optional) Parameters to append to the API URL.
   * @param queryPrams - (Optional) Query parameters to append to the API URL.
   * @returns Observable with the response data.
   */
  GetMethodWithPipe(Api_Name: string, params?: string, queryPrams?: string) {
    let url = this.baseUrl + Api_Name;

    if (params) {
      url += `/${params}`;
    }

    if (queryPrams) {
      url += queryPrams;
    }

    return this.http.get(url).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => this.handleErrorMessage(error))
    );
  }

  /**
   * Sends a POST request to the specified API.
   *
   * @param Api_name - API endpoint to call.
   * @param body - The data to send in the body of the POST request.
   * @returns Observable with the response data.
   */
  PostMethodWithPipe<T>(Api_name: string, body: any): Observable<T> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<T>(this.baseUrl + Api_name, body, options)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleErrorMessage(error))
      );
  }

  /**
   * Sends a DELETE request to the specified API.
   *
   * @param Api_name - API endpoint to call.
   * @param params - (Optional) Parameters to append to the API URL.
   * @param body - (Optional) The data to send in the body of the DELETE request.
   * @returns Observable with the response data.
   */
  DeleteMethodWithPipe(Api_name: string, params?: string, body?: any) {
    const url = params
      ? `${this.baseUrl + Api_name}/${params}`
      : this.baseUrl + Api_name;
    const options = body ? { body } : {};

    return this.http
      .delete(url, options)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleErrorMessage(error))
      );
  }

  /**
   * Sends a PUT request to the specified API.
   *
   * @param Api_name - API endpoint to call.
   * @param params - (Optional) Parameters to append to the API URL.
   * @param body - The data to send in the body of the PUT request.
   * @returns Observable with the response data.
   */
  UpdateMethodWithPipe(Api_name: string, params?: string, body?: any) {
    const url = params
      ? `${this.baseUrl + Api_name}/${params}`
      : this.baseUrl + Api_name;

    return this.http
      .put(url, body)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleErrorMessage(error))
      );
  }

  /**
   * Sends a PATCH request to the specified API.
   *
   * @param Api_name - API endpoint to call.
   * @param params - (Optional) Parameters to append to the API URL.
   * @param body - The data to send in the body of the PATCH request.
   * @returns Observable with the response data.
   */
  PatchMethodWithPipe(Api_name: string, params?: string, body?: any) {
    const url = params
      ? `${this.baseUrl + Api_name}/${params}`
      : this.baseUrl + Api_name;

    return this.http
      .patch(url, body)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleErrorMessage(error))
      );
  }

  /**
   * Handles HTTP errors by logging the error and returning a user-friendly message.
   *
   * @param error - The error response from the HTTP request.
   * @returns Observable throwing an error with a user-friendly message.
   */
  private handleErrorMessage(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
