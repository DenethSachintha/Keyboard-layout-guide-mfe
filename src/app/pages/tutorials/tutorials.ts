import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportsModule } from '../../imports';
import { TutorialService } from '../services/tutorial.service';
import { Tutorial } from '../../models/tutorial';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './tutorials.html',
  styleUrls: ['./tutorials.scss']
})
export class Tutorials implements OnInit {
  tutorials: Tutorial[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tutorialService: TutorialService
  ) {}

  ngOnInit(): void {
    this.loadTutorials();
  }

  loadTutorials() {
    this.tutorialService.getTutorials().subscribe((data) => {
      this.tutorials = data;
    });
  }

  viewModules(id: number) {
    this.router.navigate(['../modules', id], { relativeTo: this.route });
  }
}
