import { Component, signal } from '@angular/core';
import { ImportsModule } from './imports';
import { PrimeNG } from 'primeng/config';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,ImportsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Keyboard-layout-host-mfe');
  constructor(private primeng: PrimeNG) {}

    ngOnInit() {
        this.primeng.ripple.set(true);
    }
}
