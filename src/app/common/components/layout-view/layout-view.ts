import { Component, Input, signal, computed, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { CommonModule } from '@angular/common';
import { KeyMapping } from '../../../models/key-mapping';

@Component({
  selector: 'app-layout-view',
  imports: [ImportsModule, CommonModule],
  templateUrl: './layout-view.html',
  styleUrl: './layout-view.scss',
})
export class LayoutView implements OnInit, OnChanges {
  private _keyMapping: KeyMapping[] = [];

  @Input()
  set keyMapping(value: KeyMapping[]) {
    this._keyMapping = value || [];
    if (this._keyMapping.length) {
      this.processKeyMapping();
      console.log('Processing keyMapping via setter:', this._keyMapping);
    }
  }
  get keyMapping(): KeyMapping[] {
    return this._keyMapping;
  }

  @Input() isShiftActive = false;
  @Input() expectedKeyId: number | null = null;

  activeKeys = signal<Record<number, boolean>>({});

  ngOnInit(): void {
    if (this.keyMapping.length) {
      this.processKeyMapping();
      console.log('Processing keyMapping on init:', this.keyMapping);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['keyMapping'] && changes['keyMapping'].currentValue?.length) {
      this.processKeyMapping();
      console.log('Processing keyMapping via ngOnChanges:', this.keyMapping);
    }
  }

  private processKeyMapping(): void {
    const newActiveKeys: Record<number, boolean> = {};
    for (const key of this.keyMapping) {
      newActiveKeys[key.id] = false;
    }
    this.activeKeys.set(newActiveKeys);
  }

  get keyboardRows(): KeyMapping[][] {
    const rowBreaks = [14, 28, 41, 53, 61];
    const rows: KeyMapping[][] = [];
    let start = 0;
    for (const end of rowBreaks) {
      rows.push(this.keyMapping.slice(start, end));
      start = end;
    }
    return rows;
  }

  highlightKey(key: string, state: boolean) {
    const found = this.keyMapping.find(
      (k) => k.systemKey.toLowerCase() === key.toLowerCase()
    );
    if (found) {
      const current = this.activeKeys();
      this.activeKeys.set({ ...current, [found.id]: state });
    }
  }

  shouldShowShiftSymbol(key: KeyMapping): boolean {
    return (
      !!key.virtualShift &&
      !/^[a-zA-Z]$/.test(key.virtualKey) &&
      key.virtualKey.trim() !== ''
    );
  }

  getKeyBinding(key: KeyMapping) {
    return computed(() => {
      const isActive = !!this.activeKeys()[key.id];
      const isExpected = this.expectedKeyId === key.id;
      const isShiftKey =
        this.isShiftActive &&
        (key.systemKey === 'Shift' || key.virtualKey === 'Shift');

      const bg = isExpected
        ? 'bg-yellow-400 text-black'
        : isActive || isShiftKey
        ? 'bg-primary text-primary-contrast'
        : 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-200';

      return {
        class: ['key', bg],
        style: { transition: 'all 0.2s ease', cursor: 'pointer' },
        'data-key': key.id,
        'aria-label': key.virtualKey,
      };
    });
  }
}