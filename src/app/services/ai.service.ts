import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly API = `${environment.api}/ai`;

  constructor(private http: HttpClient) { }

  generateImageCaption(file: File){
    const body = new FormData();
    body.set('file', file);
    return this.http.post<string>(`${this.API}/text/ImageCaption`, body);
  }
}
