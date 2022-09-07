import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'uniq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'client';

  public readonly lessons = fetch('/api/lessons')
    .then(r => r.json() as Promise<unknown[]>)
    .then(l => l.slice(0, 10));
}
