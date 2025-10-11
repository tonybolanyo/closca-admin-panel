import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CookiesComponent } from './shared/components/cookies/cookies.component';
import { LoggedUserService } from './shared/services/logged-user.service';

@Component({
  standalone: true,
    imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private loggedUserService: LoggedUserService,
    private bottomSheet: MatBottomSheet,
  ) {
    this.loggedUserService.checkLoggedUser();
  }

  checkAllowCookies() {
    const bottomSheetRef = this.bottomSheet.open(CookiesComponent, { disableClose: true });

    bottomSheetRef
      .afterDismissed()
      .subscribe(
        (response) => {
        }
      );
  }




}

