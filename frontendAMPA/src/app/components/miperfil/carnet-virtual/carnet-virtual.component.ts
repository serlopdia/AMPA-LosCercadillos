import { formatDate, registerLocaleData } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener, LOCALE_ID, Inject } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { Subscription, interval, takeUntil } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  dni: string;
  address: string;
  username: string;
  password: string;
  created_at: string;
}

@Component({
  selector: 'app-carnet-virtual',
  templateUrl: './carnet-virtual.component.html',
  styleUrls: ['./carnet-virtual.component.scss']
})
export class CarnetVirtualComponent implements OnInit, OnDestroy {

  socio!: Socio;
  currentTime: Date | undefined;
  formattedDate: string | undefined;
  private refreshSubscription: Subscription | undefined;

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): void {
    event.preventDefault();
  }

  constructor(private usersService: UsersService, @Inject(LOCALE_ID) private locale: string) {
    registerLocaleData(localeEs);
  }

  ngOnInit(): void {
    this.getDatosSocio();
    this.startClockTimer();
    this.startPageReloadTimer();
  }

  ngOnDestroy(): void {
    this.stopTimers();
  }

  getDatosSocio() {
    this.usersService.getUserData().subscribe({
      next: data => {
        this.socio = data as Socio;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  startClockTimer() {
    this.refreshSubscription = interval(1000)
      .subscribe(() => {
        this.getCurrentTime();
      });
  }

  startPageReloadTimer() {
    interval(45000)
      .subscribe(() => {
        location.reload();
      });
  }

  stopTimers() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getCurrentTime() {
    this.currentTime = new Date();
    this.formattedDate = formatDate(this.currentTime, 'EEEE d MMMM \'de\' yyyy, HH:mm:ss', this.locale);
  }
}
