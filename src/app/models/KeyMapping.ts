export interface KeyMapping {
  id: number;
  systemKey: string;
  virtualKey: string;
  systemShift?: string; // new optional field for Shift output
  virtualShift?: string; // new optional field for Shift output
}