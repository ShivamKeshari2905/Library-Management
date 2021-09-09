import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { BooksTableComponent } from './books-table/books-table.component';
import { AddBookComponent } from './add-book/add-book.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { IssueBookComponent } from './issue-book/issue-book.component';
import { MyInterceptor } from './services/MyInterceptor';
import { ButtonRendererComponent } from './button-renderer/button-renderer.component';
import { UserTableComponent } from './user-table/user-table.component';
import { AuthRendererComponent } from './auth-renderer/auth-renderer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LateSubmissionComponent } from './late-submission/late-submission.component';
import { UserService } from './services/user.service';
import { BookService } from './services/book.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ErrorsHandler } from './services/error-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    BooksTableComponent,
    AddBookComponent,
    IssueBookComponent,
    ButtonRendererComponent,
    UserTableComponent,
    AuthRendererComponent,
    PageNotFoundComponent,
    LateSubmissionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    GridModule
  ],
  providers: [UserService, BookService, AuthGuardService, { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },{
    provide: ErrorHandler,
    useClass: ErrorsHandler,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
