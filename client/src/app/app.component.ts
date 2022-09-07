import { isNotNill } from '@solovevserg/uniq-shared/dist/utils/is-not-nill'
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs';
import { WorkerFacadeService } from './worker/worker-facade.service';

@Component({
  selector: 'uniq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  constructor(
    private readonly worker: WorkerFacadeService,
    private readonly fb: FormBuilder,
  ) { }

  public readonly form = this.fb.group({
    group: this.fb.control(''),
  })

  public readonly lessons = this.form.valueChanges.pipe(
    startWith(this.form.value),
    map(({ group }) => group),
    filter(isNotNill),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => this.worker.runTask({
      type: 'SearchGroupsWorkerTask',
      params: {
        query,
      },
    })),
  )
}
