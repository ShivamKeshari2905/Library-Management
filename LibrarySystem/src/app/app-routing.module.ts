import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { BooksTableComponent } from './books-table/books-table.component';
import { HomeComponent } from './home/home.component';
import { IssueBookComponent } from './issue-book/issue-book.component';
import { LateSubmissionComponent } from './late-submission/late-submission.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserTableComponent } from './user-table/user-table.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'books', component: BooksTableComponent },
  { path: 'books/:id', component: BooksTableComponent },
  { path: 'add', component: AddBookComponent },
  { path: 'issueBook', component: IssueBookComponent, canActivate: [AuthGuardService] },
  { path: 'usertable', component: UserTableComponent, canActivate: [AuthGuardService] },
  { path: 'late-submission', component: LateSubmissionComponent, canActivate: [AuthGuardService] },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
