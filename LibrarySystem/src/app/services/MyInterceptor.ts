import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { from } from 'rxjs';
import { Observable } from 'rxjs';
import { UtilityService } from './utility.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
    constructor(private msalService: UtilityService) { }

    intercept(
        httpRequest: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return from(this.handleAccess(httpRequest, next));
    }

    private async handleAccess(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Promise<HttpEvent<any>> {
        const token = await this.msalService.getToken();

        if (token) {
            console.log('token found');
            const clonedRequest = request.clone({
                setHeaders: { 'x-access-token': token },
            });
            return next.handle(clonedRequest).toPromise();
        }
        return next.handle(request).toPromise();
    }
}
