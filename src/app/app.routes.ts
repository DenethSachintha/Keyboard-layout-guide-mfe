import { Routes } from '@angular/router';
import { LayoutView } from './common/components/layout-view/layout-view';
import { Session } from './pages/session/session';


export const routes: Routes = [
  { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: 'tutorials', component: Session },
  { path: 'modules', component: LayoutView  },//tuto id
  { path: 'sessions', component: Session  },// module id
];
