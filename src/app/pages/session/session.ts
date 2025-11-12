// It should handle session start, pause, resume, and end functionalities. When ui initiates start button appears.
// after start this button disappear and load pause and end buttons. if user click pause during session pause button will be disapaer and load resume button alongside with end button.
// There will be a reset button after session start to end //  buttons will be handled this manner Come up  with suitable behavior for these buttons and their placements.(somthing LIKE reset will be disapear after licking start and will appear again))
// // wpm calculate does not matter weather words are correct or not just finishing is enough. WPM uses Number of words not number of letters
// // Additionally, it should track the duration of the session and the number of letters typed correctly.
//  session duration should calculate from start to end in seconds excluding pause time .
// // then generate typing speed and accuracy statistics at the end of the session. Just Console log for now.

// each module has following details:
/* {
      moduleId: 2,
      tutorialId: 1,
      moduleName: 'Basic Words',
      description: 'Practice short common words to improve rhythm and accuracy.',
      isCompleted: false,
      sentenceArray: [
        'the quick brown fox jumps over the lazy dog',
        'hello world this is a typing test'],
      completedTime: null,
      estimatedTime: '15 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 60,
      moduleWiseTargetAccuracy: 60,
      moduleWiseBestAccuracy: 60,
      moduleWiseTargetWPM: 20,
      moduleWiseExpectedWPM: 20,
      moduleWiseBestWPM: 20,
      numberOfSessions: 0,
    }, */

// session means a single practice attempt of a module
// module details will be hard coded for now
// we need to UI implementations for a single session page
// these sessions are linked to modules
// use primeng components similar to other pages
// no buttons for navigation needed here
// hardcode some sample sessions data here according to below structure

// session has following details:
// - session id
// - module id
// - stepIndex
// - acccuracy
// - wpm
// - sentence
// - stepTimeSeconds
// - dateTime
// - isCompleted (boolean)

// session component should extract secentence array from module details and use it for typing practice inside constructor
/* constructor() {
    const exampleText = 'Type this example text 123!@#';
    this.wordArray.set(exampleText.split(''));
  }
in html should show these sentences in prime ng sttepper. each centence in a step. user types below the stepper inside p-step-panel
when user finishes one sentence and move to next step session should pause automatically. when user comes back to that step and start typing session should resume automatically.
here i provided stepper example


sessions should pause when user progess and switches to another sentence (step) in the stepper and resume when user types again.
also wen user start typing session should start when user comes to this page.
Important::do not change <p-toolbar and  other existing features in this ccomponent

*/

import { Component, HostListener, signal, computed, OnInit } from '@angular/core';
import { LayoutView } from '../../common/components/layout-view/layout-view';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { KeyMappingService } from '../services/key-mapping.service';
import { Module } from '../../models/module';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from '../services/module.service';
import { SessionRecord } from '../../models/session-record ';
import { SessionService } from '../services/session.service';
import { KeyMapping } from '../../models/key-mapping';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [LayoutView, ImportsModule, CommonModule],
  templateUrl: './session.html',
  styleUrls: ['./session.scss'],
})
export class Session implements OnInit {
  moduleId!: number;
  currentModule!: Module | undefined;

  // Sentences (hardcoded module-like object for demo)
  sentences = signal<string[]>([]);
  // current active sentence splitted as char array
  wordArray = signal<string[]>([]);
  userInput = signal<string[]>([]); // chars typed for current sentence
  currentIndex = signal<number>(0); // index inside current sentence
  currentStep = signal<number>(0); // step index (0-based)
  isShiftActive = signal<boolean>(false);
  expectedKeyId = signal<number | null>(null);
  // Session flags
  isStarted = signal<boolean>(false); // overall session started
  isPaused = signal<boolean>(false);
  isEnded = signal<boolean>(false);

  // Timing
  // step start timestamp (ms) when typing in the current step actually starts
  private stepStartTime: number | null = null;
  // cumulative active time across completed steps (ms)
  private cumulativeActiveTime = 0;

  // Session records for each completed step
  sessionRecords: SessionRecord[] = [];

  // computed result map for current sentence
  result = computed(() =>
    this.wordArray().map((char, i) => {
      const inputChar = this.userInput()[i];
      if (inputChar === undefined || inputChar === '') return 'pending';
      return inputChar === char ? 'correct' : 'incorrect';
    })
  );

  keyMapping = signal<KeyMapping[]>([]); // ✅ reactive signal

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private keyService: KeyMappingService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadModule();
    this.loadKeyMapping();
    this.loadStep(0);
  }

  private loadModule(): void {
    this.moduleService.getModules().subscribe({
      next: (modules) => {
        this.currentModule = modules.find((m) => m.moduleId === this.moduleId);
        if (this.currentModule) {
          this.sentences.set(this.currentModule.sentenceArray);
          console.log('✅ Loaded sentences:', this.sentences());
        } else {
          console.error(`❌ Module with ID ${this.moduleId} not found.`);
        }
      },
      error: (err) => console.error('Failed to load modules:', err),
    });
  }

  /** ✅ Load key mappings asynchronously (reactive with signals) */
  private async loadKeyMapping(): Promise<void> {
    try {
      const keys = await this.keyService.getAll();
      this.keyMapping.set(keys); // <-- signal update triggers child immediately
      console.log('✅ Loaded key mappings:', this.keyMapping());
    } catch (err) {
      console.error('Failed to load key mappings:', err);
    }
  }
  private loadStep(stepIndex: number) {
    // lock step navigation: user cannot switch steps (we honor currentStep only)
    const s = this.sentences()[stepIndex] ?? '';
    this.wordArray.set(s.split(''));
    this.userInput.set(new Array(this.wordArray().length).fill(''));
    this.currentIndex.set(0);
    this.currentStep.set(stepIndex);
    this.expectedKeyId.set(null);
    this.stepStartTime = null; // step hasn't started typing yet
  }

  // -------------------------
  // Session control methods
  // -------------------------
  startSession() {
    // start overall session and current step typing
    if (this.isStarted()) return;
    this.isStarted.set(true);
    this.isPaused.set(false);
    this.isEnded.set(false);
    // mark step start (first keydown will set true startTime)
    this.stepStartTime = null;
    console.log('Session started (manual).');
  }

  pauseSession() {
    if (!this.isStarted() || this.isPaused()) return;
    this.isPaused.set(true);
    // if typing was active in this step, add to cumulative and clear step timer
    if (this.stepStartTime) {
      const stepDuration = performance.now() - this.stepStartTime;
      this.cumulativeActiveTime += stepDuration;
      this.stepStartTime = null;
    }
    console.log('Session paused.');
  }

  resumeSession() {
    if (!this.isStarted() || !this.isPaused()) return;
    this.isPaused.set(false);
    // resume step: start timer for active part
    this.stepStartTime = performance.now();
    console.log('Session resumed.');
  }

  endSession() {
    if (!this.isStarted()) return;
    // finalize current step if in progress
    if (this.stepStartTime) {
      const dur = performance.now() - this.stepStartTime;
      this.cumulativeActiveTime += dur;
      this.stepStartTime = null;
    }
    this.isStarted.set(false);
    this.isPaused.set(false);
    this.isEnded.set(true);

    console.log('Session ended. All step records:', this.sessionRecords);
  }

  resetSession() {
    this.userInput.set([]);
    this.currentIndex.set(0);
    this.currentStep.set(0);
    this.isStarted.set(false);
    this.isPaused.set(false);
    this.isEnded.set(false);
    this.stepStartTime = null;
    this.cumulativeActiveTime = 0;
    this.sessionRecords = [];
    this.loadStep(0);
    console.log('Session reset.');
  }

  // -------------------------
  // Key handling (global)
  // -------------------------
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // ignore global keys if session ended
    if (this.isEnded()) return;

    // Control Shift state
    if (event.key === 'Shift') {
      this.isShiftActive.set(true);
      return;
    }

    // block Tab default
    if (event.key === 'Tab') {
      event.preventDefault();
      return;
    }

    // Backspace handling
    if (event.key === 'Backspace') {
      if (!this.isStarted() || this.isPaused()) return;
      this.currentIndex.update((i) => Math.max(0, i - 1));
      const arr = [...this.userInput()];
      arr[this.currentIndex()] = '';
      this.userInput.set(arr);
      this.updateExpectedKey();
      return;
    }

    // If character keys:
    if (event.key.length === 1) {
      // If session not started yet -> start automatically
      if (!this.isStarted()) {
        this.isStarted.set(true);
        this.isPaused.set(false);
        console.log('Session auto-started by user typing.');
      }

      // If step is paused (we pause on step auto-advance) resume when user types in the new step
      if (this.isPaused()) {
        this.resumeSession();
      }

      // ensure step timer started
      if (!this.stepStartTime) {
        this.stepStartTime = performance.now();
      }

      // If still paused (edge), skip processing
      if (this.isPaused()) return;

      // map key to virtual char using keyMapping
      let mapping;
      let mappedChar: string | undefined;

      if (!this.isShiftActive()) {
            mapping = this.keyMapping().find((m) => m.systemKey === event.key);
          } else {
            mapping = this.keyMapping().find((m) => m.systemShift === event.key);
          }

      mappedChar = !this.isShiftActive()
        ? mapping?.virtualKey ?? ''
        : mapping?.virtualShift ?? mapping?.virtualKey ?? '';
       /*  mappedChar = mapping
        ? this.isShiftActive() && mapping.virtualShift
          ? mapping.virtualShift
          : mapping.virtualKey
        : event.key; */

      // write mappedChar into userInput at currentIndex
      const arr = [...this.userInput()];
      arr[this.currentIndex()] = mappedChar ?? '';
      this.userInput.set(arr);
      this.currentIndex.update((i) => i + 1);
      this.updateExpectedKey();

      // If finished current sentence -> finalize step
      if (this.currentIndex() >= this.wordArray().length) {
        this.finishCurrentStep();
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.isShiftActive.set(false);
    }
  }

  // -------------------------
  // Step finishing & stats
  // -------------------------
  private finishCurrentStep() {
    // compute step duration
    let stepDurationMs = 0;
    if (this.stepStartTime) {
      stepDurationMs = performance.now() - this.stepStartTime;
      this.cumulativeActiveTime += stepDurationMs;
      this.stepStartTime = null;
    }

    const stepIndex = this.currentStep();
    const sentence = this.sentences()[stepIndex] ?? '';
    const typed = this.userInput().join('');
    const sentenceChars = sentence.split('');
    // correct letters count
    const correctCount = sentenceChars.reduce((acc, ch, i) => {
      return acc + (this.userInput()[i] === ch ? 1 : 0);
    }, 0);

    // step accuracy
    const accuracyPct = sentenceChars.length > 0 ? (correctCount / sentenceChars.length) * 100 : 0;

    // cumulative words completed (space-separated)
    const completedSentences = this.sentences().slice(0, stepIndex + 1);
    const totalWordsCompleted = completedSentences
      .map((s) => s.trim())
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length;

    // cumulative time in minutes
    const cumulativeMinutes = Math.max(1, this.cumulativeActiveTime / 60000); // avoid divide by zero
    const cumulativeWpm = totalWordsCompleted / cumulativeMinutes;

    const rec: SessionRecord = {
    sessionId: 0,
    moduleId: this.moduleId,
    stepIndex,
    sentence,
    accuracy: Number(accuracyPct.toFixed(2)),
    wpm: Number(cumulativeWpm.toFixed(2)),
    stepTimeSeconds: Number((stepDurationMs / 1000).toFixed(2)),
    dateTime: new Date().toISOString(),
    isCompleted: true,
  };

  // Save locally
  this.sessionRecords.push(rec);

  // ✅ Send to service (mocked POST)
  this.saveSessionStep(rec);

  // auto-advance

    // auto-advance to next step if available
    const next = stepIndex + 1;
    if (next < this.sentences().length) {
      // Advance to next step but PAUSE session (user must type to resume)
      this.loadStep(next);
      this.isPaused.set(true);
      // set userInput empty for the next step is handled by loadStep
      console.log(`Auto-advanced to step ${next + 1}. Session paused until typing starts.`);
    } else {
      // last step finished → end whole session
      this.endSession();
    }
  }
private saveSessionStep(step: SessionRecord) {
  this.sessionService.addSessionStep(step).subscribe({
    next: (res) => console.log('Session step saved via service:', res),
    error: (err) => console.error('Failed to save session step:', err),
  });
}
  // -------------------------
  // Helpers
  // -------------------------
  updateExpectedKey() {
    const nextChar = this.wordArray()[this.currentIndex()];
    if (!nextChar) {
      this.expectedKeyId.set(null);
      return;
    }
    const found = this.keyMapping().find(
      (m) => m.virtualKey.toLowerCase() === nextChar.toLowerCase()
    );
    this.expectedKeyId.set(found ? found.id : null);
  }

  // Prevent user from clicking step list to change steps
  onStepClick(event: Event) {
    // stop any step click navigation: user cannot change steps manually
    event.preventDefault();
    event.stopPropagation();
    // optional: show a tooltip/toast if you want to inform the user
  }
}
