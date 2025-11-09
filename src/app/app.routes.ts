import { Routes } from '@angular/router';
import { LayoutView } from './common/components/layout-view/layout-view';
import { Session } from './pages/session/session';
import { Tutorials } from './pages/tutorials/tutorials';
import { Modules } from './pages/modules/modules';
import { Sessions } from './pages/sessions/sessions';

export const routes: Routes = [
  { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: 'tutorials', component: Tutorials },
  { path: 'modules/:id', component: Modules },
  { path: 'sessions/:id', component: Sessions },
  { path: 'session/:id', component: Session }, // session id
];
