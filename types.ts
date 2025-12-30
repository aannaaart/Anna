
export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  WIN = 'WIN'
}

export interface WishResult {
  wish: string;
  fortune: string;
}
