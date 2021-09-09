import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const httpOptionsWithToken = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UserService {

  lateSubmissionList = new BehaviorSubject<any[] | undefined>(undefined);
  message = this.lateSubmissionList.asObservable();

  updateLateSubmissionList(data: any[]) {
    this.lateSubmissionList.next(data)
  };

  getIssuedBook(userId: any) {
    const Url = `http://localhost:3000/api/test/user/${userId}/books`
    const URL = `http://localhost:3000/api/test/putAuth`
    console.log(Url);
    return this.http.get(Url, httpOptions);
  }

  constructor(private http: HttpClient) { }

  registerNewUser(userDetails: any) {
    return this.http.post('http://localhost:3000/api/auth/signup', userDetails, httpOptions);
  }

  loginUser(userDetails: any) {
    return this.http.post('http://localhost:3000/api/auth/signin', userDetails, httpOptions);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/test/users', httpOptions);
  }

  updateAuth(id:any,user: any): Observable<User[]> {
    return this.http.put<User[]>('http://localhost:3000/api/test/putAuth/'+id, user, httpOptions) 
  }

  issueNewBook(payload: Object) {
    return this.http.patch('http://localhost:3000/api/test/updateUser', payload, httpOptions);
  }

  getLateSubmissionList() {
    return this.http.get('http://localhost:3000/api/test/users/lateSubmission', httpOptions);
  }
}
