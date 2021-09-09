import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-late-submission',
  templateUrl: './late-submission.component.html',
  styleUrls: ['./late-submission.component.scss'],
})
export class LateSubmissionComponent implements OnInit {
  lateSubmissionList!: any[];
  lateSubmissionSubscription!: Subscription;

  constructor(private route: ActivatedRoute, public userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.lateSubmissionSubscription = this.userService.message.subscribe(
      (data) => this.onListSubscription(data)
    );
  }

  ngOnDestroy() { }

  onListSubscription(data: any[] | undefined) {
    if (data) {
      this.lateSubmissionList = data;
    }
  }

  getColorFromSubmissionDate(borrows: {
    submissiondate: string;
    borrowdate: string;
  }) {
    const { borrowdate, submissiondate } = borrows;
    const startDay = new Date(borrowdate);
    const endDay = new Date(submissiondate);

    const days = parseInt(this.getDifferenceInDays(startDay, endDay));

    if ((days) >= 15) {
      return 'alert alert-red';
    } else if (days === 14) {
      return 'alert alert-orange';
    } else if (days === 13) {
      return 'alert alert-yellow';
    }
    return '';
  }

  getDifferenceInDays(date1: Date, date2: Date) {
    const differenceInTime = date2.getTime() - date1.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays.toFixed(0);
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  alertOne() {
    alert("No late Submission");
  }
}
