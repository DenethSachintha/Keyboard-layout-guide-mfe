import { Component, HostListener, signal, computed } from '@angular/core';
import { LayoutView } from '../../common/components/layout-view/layout-view';
import { CommonModule } from '@angular/common';
export interface KeyMapping {
  id: number;
  systemKey: string;
  virtualKey: string;
  systemShift?: string; // new optional field for Shift output
  virtualShift?: string; // new optional field for Shift output
}
@Component({
  selector: 'app-session',
  templateUrl: './session.html',
  styleUrls: ['./session.scss'],
  imports: [LayoutView, CommonModule],
})
export class Session {
  wordArray = signal<string[]>([]);
  userInput = signal<string[]>([]);
  currentIndex = signal<number>(0);
  isShiftActive = signal<boolean>(false);
  expectedKeyId = signal<number | null>(null);

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
    this.updateExpectedKey();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log('Key Down:', event.key);
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
      this.updateExpectedKey(); // update highlight
      return;
    }

    if (event.key.length === 1) {
      let mapping;
      let mappedChar;
      if (!this.isShiftActive()) {
        mapping = this.keyMapping.find((m) => m.systemKey === event.key);
        console.log('Mapping found:', mapping?.systemKey);
      }
      if (this.isShiftActive()) {
        mapping = this.keyMapping.find((m) => m.systemShift === event.key);
        console.log('Mapping found:', mapping?.systemShift);
      }
      if (!mapping) return;

      if (!this.isShiftActive()) {
        mappedChar = mapping.virtualKey;
      }
      if (this.isShiftActive() && mapping.systemShift && mapping.virtualShift) {
        mappedChar = mapping.virtualShift;
      }
      console.log('mappedChar found:', mappedChar);

      const arr = [...this.userInput()];
      arr[this.currentIndex()] = mappedChar ?? '';
      this.userInput.set(arr);
      this.currentIndex.update((i) => i + 1);
      this.updateExpectedKey();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.isShiftActive.set(false);
    }
  }

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

  resetSession() {
    this.userInput.set([]);
    this.currentIndex.set(0);
    this.expectedKeyId.set(null);
  }
}

// It should handle session start, pause, resume, and end functionalities.
// Additionally, it should track the duration of the session and the number of words typed.
// then generate typing speed and accuracy statistics at the end of the session.
// alongside that each session will be provided related configurations like time session id, session name, expepted words per minute(wpmTarget), and accuracy targets(accuracyTarget), previous best accuracy (bestAccuracy),
// previous best wpm (bestWpm), number of times Attented (countAttented), Whether session previously completed (isCompleted), Completed time (timeCompleted), whether session previously done( isActive), .
