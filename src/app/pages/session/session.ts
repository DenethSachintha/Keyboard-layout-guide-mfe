// It should handle session start, pause, resume, and end functionalities. When ui initiates start button appears. 
// after start this button disappear and load pause and end buttons. if user click pause during session pause button will be disapaer and load resume button alongside with end button. 
// There will be a reset button after session start to end //  buttons will be handled this manner Come up  with suitable behavior for these buttons and their placements.(somthing LIKE reset will be disapear after licking start and will appear again))
// // wpm calculate does not matter weather words are correct or not just finishing is enough. WPM uses Number of words not number of letters 
// // Additionally, it should track the duration of the session and the number of letters typed correctly. 
//  session duration should calculate from start to end in seconds excluding pause time .
// // then generate typing speed and accuracy statistics at the end of the session. Just Console log for now.


// alongside that each session will be provided related configurations like time session id, session name,
//  expepted words per minute(wpmTarget), and accuracy targets(accuracyTarget), previous best accuracy (bestAccuracy),
// previous best wpm (bestWpm), number of times Attented (countAttented), 
// Whether session previously completed (isCompleted), Completed time (timeCompleted), 
// whether session previously done( isActive), .

/* {
      moduleId: 2,
      tutorialId: 1,
      title: 'Basic Words',
      description: 'Practice short common words to improve rhythm and accuracy.',
      isCompleted: false,
      estimatedTime: '15 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 60,
      moduleWiseRequiredWPM: 20
    }, */

// session means a single practice attempt of a module
// we need to UI implementations for a single session page
// these sessions are linked to modules
// hardcode some sample sessions data here
// use primeng components similar to other pages
// no buttons for navigation needed here
// session has following details:
// - session id
// - module id  
// - acccuracy
// - wpm
// - time taken
// - date time
// - completed (boolean)
import { Component, HostListener, signal, computed } from '@angular/core';
import { LayoutView } from '../../common/components/layout-view/layout-view';
import { CommonModule } from '@angular/common';
import { KeyMapping } from '../../models/KeyMapping';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [LayoutView,ImportsModule, CommonModule],
  templateUrl: './session.html',
  styleUrls: ['./session.scss']
})
export class Session {
  // --- Reactive state ---
  wordArray = signal<string[]>([]);
  userInput = signal<string[]>([]);
  currentIndex = signal<number>(0);
  isShiftActive = signal<boolean>(false);
  expectedKeyId = signal<number | null>(null);

  // --- Session control flags ---
  isStarted = signal<boolean>(false);
  isPaused = signal<boolean>(false);
  isEnded = signal<boolean>(false);

  // --- Timing and stats ---
  startTime: number | null = null;
  pausedTime: number | null = null;
  totalPausedDuration = 0;

  result = computed(() =>
    this.wordArray().map((char, i) => {
      const inputChar = this.userInput()[i];
      if (inputChar === undefined || inputChar === '') return 'pending';
      return inputChar === char ? 'correct' : 'incorrect';
    })
  );

  constructor() {
    const exampleText = 'Type this example text 123!@#';
    this.wordArray.set(exampleText.split(''));
  }

  // --- Controls ---
  startSession() {
    this.resetSession();
    this.isStarted.set(true);
    this.isPaused.set(false);
    this.isEnded.set(false);
    this.startTime = performance.now();
    console.log('🟢 Session started');
    this.updateExpectedKey();
  }

  pauseSession() {
    if (!this.isStarted() || this.isPaused()) return;
    this.isPaused.set(true);
    this.pausedTime = performance.now();
    console.log('⏸️ Session paused');
  }

  resumeSession() {
    if (!this.isPaused()) return;
    this.isPaused.set(false);
    if (this.pausedTime) {
      this.totalPausedDuration += performance.now() - this.pausedTime;
      this.pausedTime = null;
    }
    console.log('▶️ Session resumed');
  }

  endSession() {
    if (!this.isStarted() || this.isEnded()) return;
    this.isEnded.set(true);
    this.isStarted.set(false);
    this.isPaused.set(false);

    const endTime = performance.now();
    const duration = (endTime - (this.startTime ?? 0) - this.totalPausedDuration) / 1000; // seconds

    this.generateStats(duration);
  }

  resetSession() {
    this.userInput.set([]);
    this.currentIndex.set(0);
    this.expectedKeyId.set(null);
    this.isStarted.set(false);
    this.isPaused.set(false);
    this.isEnded.set(false);
    this.startTime = null;
    this.pausedTime = null;
    this.totalPausedDuration = 0;
    console.log('🔄 Session reset');
  }

  // --- Keyboard events ---
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isStarted() || this.isPaused()) return;

    if (event.key === 'Shift') {
      this.isShiftActive.set(true);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      this.currentIndex.update((i) => Math.max(0, i - 1));
      const arr = [...this.userInput()];
      arr[this.currentIndex()] = '';
      this.userInput.set(arr);
      this.updateExpectedKey();
      return;
    }

    if (event.key.length === 1) {
      let mapping;
      let mappedChar;

      if (!this.isShiftActive()) {
        mapping = this.keyMapping.find((m) => m.systemKey === event.key);
      } else {
        mapping = this.keyMapping.find((m) => m.systemShift === event.key);
      }

      if (!mapping) return;

      mappedChar = !this.isShiftActive()
        ? mapping.virtualKey
        : mapping.virtualShift ?? mapping.virtualKey;

      const arr = [...this.userInput()];
      arr[this.currentIndex()] = mappedChar ?? '';
      this.userInput.set(arr);
      this.currentIndex.update((i) => i + 1);
      this.updateExpectedKey();

      // Auto-end when all chars typed
      if (this.currentIndex() >= this.wordArray().length) {
        this.endSession();
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') this.isShiftActive.set(false);
  }

  // --- Helpers ---
  updateExpectedKey() {
    const nextChar = this.wordArray()[this.currentIndex()];
    if (!nextChar) {
      this.expectedKeyId.set(null);
      return;
    }
    const found = this.keyMapping.find(
      (m) => m.virtualKey.toLowerCase() === nextChar.toLowerCase()
    );
    this.expectedKeyId.set(found ? found.id : null);
  }

  generateStats(durationSeconds: number) {
    const minutes = durationSeconds / 60;
    const totalWords = this.wordArray().join('').split(' ').length;
    const correctCount = this.result().filter((r) => r === 'correct').length;
    const accuracy = ((correctCount / this.wordArray().length) * 100).toFixed(2);
    const wpm = (totalWords / minutes).toFixed(2);

    console.log('🏁 Session Ended');
    console.log(`Duration: ${durationSeconds.toFixed(1)}s`);
    console.log(`Words per Minute (WPM): ${wpm}`);
    console.log(`Accuracy: ${accuracy}%`);
    console.log(`Correct letters: ${correctCount}/${this.wordArray().length}`);
  }


    keyMapping: KeyMapping[] = [
  // Row 1
  { id: 1, systemKey: 'Escape', virtualKey: 'Esc' },
  { id: 2, systemKey: '1', virtualKey: '1', systemShift: '!', virtualShift: '!' },
  { id: 3, systemKey: '2', virtualKey: '2', systemShift: '@', virtualShift: '@' },
  { id: 4, systemKey: '3', virtualKey: '3', systemShift: '#', virtualShift: '#' },
  { id: 5, systemKey: '4', virtualKey: '4', systemShift: '$', virtualShift: '$' },
  { id: 6, systemKey: '5', virtualKey: '5', systemShift: '%', virtualShift: '%' },
  { id: 7, systemKey: '6', virtualKey: '6', systemShift: '^', virtualShift: '^' },
  { id: 8, systemKey: '7', virtualKey: '7', systemShift: '&', virtualShift: '&' },
  { id: 9, systemKey: '8', virtualKey: '8', systemShift: '*', virtualShift: '*' },
  { id: 10, systemKey: '9', virtualKey: '9', systemShift: '(', virtualShift: '(' },
  { id: 11, systemKey: '0', virtualKey: '0', systemShift: ')', virtualShift: ')' },
  { id: 12, systemKey: '-', virtualKey: '-', systemShift: '_', virtualShift: '_' },
  { id: 13, systemKey: '=', virtualKey: '=', systemShift: '+', virtualShift: '+' },
  { id: 14, systemKey: 'Backspace', virtualKey: 'Backspace' },

  // Row 2
  { id: 15, systemKey: 'Tab', virtualKey: 'Tab' },
  { id: 16, systemKey: 'q', virtualKey: 'q', systemShift: 'Q', virtualShift: 'Q' },
  { id: 17, systemKey: 'w', virtualKey: 'w', systemShift: 'W', virtualShift: 'W' },
  { id: 18, systemKey: 'e', virtualKey: 'f', systemShift: 'E', virtualShift: 'F' },
  { id: 19, systemKey: 'r', virtualKey: 'p', systemShift: 'R', virtualShift: 'P' },
  { id: 20, systemKey: 't', virtualKey: 'g', systemShift: 'T', virtualShift: 'G' },
  { id: 21, systemKey: 'y', virtualKey: 'j', systemShift: 'Y', virtualShift: 'J' },
  { id: 22, systemKey: 'u', virtualKey: 'l', systemShift: 'U', virtualShift: 'L' },
  { id: 23, systemKey: 'i', virtualKey: 'u', systemShift: 'I', virtualShift: 'U' },
  { id: 24, systemKey: 'o', virtualKey: 'y', systemShift: 'O', virtualShift: 'Y' },
  { id: 25, systemKey: 'p', virtualKey: ';', systemShift: 'P', virtualShift: ':' },
  { id: 26, systemKey: '[', virtualKey: '[', systemShift: '{', virtualShift: '{' },
  { id: 27, systemKey: ']', virtualKey: ']', systemShift: '}', virtualShift: '}' },
  { id: 28, systemKey: '\\', virtualKey: '\\', systemShift: '|', virtualShift: '|' },

  // Row 3
  { id: 29, systemKey: 'CapsLock', virtualKey: 'Caps' },
  { id: 30, systemKey: 'a', virtualKey: 'a', systemShift: 'A', virtualShift: 'A' },
  { id: 31, systemKey: 's', virtualKey: 'r', systemShift: 'S', virtualShift: 'R' },
  { id: 32, systemKey: 'd', virtualKey: 's', systemShift: 'D', virtualShift: 'S' },
  { id: 33, systemKey: 'f', virtualKey: 't', systemShift: 'F', virtualShift: 'T' },
  { id: 34, systemKey: 'g', virtualKey: 'd', systemShift: 'G', virtualShift: 'D' },
  { id: 35, systemKey: 'h', virtualKey: 'h', systemShift: 'H', virtualShift: 'H' },
  { id: 36, systemKey: 'j', virtualKey: 'n', systemShift: 'J', virtualShift: 'N' },
  { id: 37, systemKey: 'k', virtualKey: 'e', systemShift: 'K', virtualShift: 'E' },
  { id: 38, systemKey: 'l', virtualKey: 'i', systemShift: 'L', virtualShift: 'I' },
  { id: 39, systemKey: ';', virtualKey: 'o', systemShift: ':', virtualShift: 'O' },
  { id: 40, systemKey: "'", virtualKey: "'", systemShift: '"', virtualShift: '"' },
  { id: 41, systemKey: 'Enter', virtualKey: 'Enter' },

  // Row 4
  { id: 42, systemKey: 'Shift', virtualKey: 'Shift' },
  { id: 43, systemKey: 'z', virtualKey: 'z', systemShift: 'Z', virtualShift: 'Z' },
  { id: 44, systemKey: 'x', virtualKey: 'x', systemShift: 'X', virtualShift: 'X' },
  { id: 45, systemKey: 'c', virtualKey: 'c', systemShift: 'C', virtualShift: 'C' },
  { id: 46, systemKey: 'v', virtualKey: 'v', systemShift: 'V', virtualShift: 'V' },
  { id: 47, systemKey: 'b', virtualKey: 'b', systemShift: 'B', virtualShift: 'B' },
  { id: 48, systemKey: 'n', virtualKey: 'k', systemShift: 'N', virtualShift: 'K' },
  { id: 49, systemKey: 'm', virtualKey: 'm', systemShift: 'M', virtualShift: 'M' },
  { id: 50, systemKey: ',', virtualKey: ',', systemShift: '<', virtualShift: '<' },
  { id: 51, systemKey: '.', virtualKey: '.', systemShift: '>', virtualShift: '>' },
  { id: 52, systemKey: '/', virtualKey: '/', systemShift: '?', virtualShift: '?' },
  { id: 53, systemKey: 'Shift', virtualKey: 'Shift' },

  // Row 5
  { id: 54, systemKey: 'Control', virtualKey: 'Ctrl' },
  { id: 55, systemKey: 'Meta', virtualKey: 'Meta' },
  { id: 56, systemKey: 'Alt', virtualKey: 'Alt' },
  { id: 57, systemKey: ' ', virtualKey: ' ' },
  { id: 58, systemKey: 'AltGraph', virtualKey: 'Alt' },
  { id: 59, systemKey: 'MetaRight', virtualKey: 'Meta' },
  { id: 60, systemKey: 'ContextMenu', virtualKey: 'Menu' },
  { id: 61, systemKey: 'ControlRight', virtualKey: 'Ctrl' },
];

}
