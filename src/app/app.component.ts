import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Store } from '@ngrx/store';
import * as AuthActions from './core/authentication/store/auth.actions';
import { AuthState } from './core/authentication/store/auth.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(private store: Store<{ auth: AuthState }>) { }

  ngOnInit(): void {
    initFlowbite();

    this.store.dispatch(AuthActions.autoLogin());

    this.isLoggedIn$ = this.store.select(state => state.auth.user).pipe(
      map(user => !!user)
    );
  }
}
