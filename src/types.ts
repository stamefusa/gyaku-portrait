export type Screen = 'home' | 'camera' | 'picker' | 'confirm' | 'result';

export interface AppState {
  pendingImage: HTMLImageElement | null;
  confirmedImage: HTMLCanvasElement | null;
  previousScreen: 'camera' | 'picker' | null;
}

export type NavigateFn = (screen: Screen) => void;
