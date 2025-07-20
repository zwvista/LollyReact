type ReviewMode = "Review(Auto)" | "Review(Manual)" | "Test" | "Textbook";

export class MReviewOptions {
  mode: ReviewMode = "Review(Auto)";
  shuffled = false;
  interval = 5;
  groupSelected = 1;
  groupCount = 1;
  speakingEnabled = true;
  reviewCount = 10;
  onRepeat = true;
  moveForward = true;
}

export interface IReviewOptions {
  options: MReviewOptions
}
