
interface Array<T> {
  move(old_index: number, new_index: number): Array<T>;
}

Array.prototype.move = function(old_index: number, new_index: number) {
  if ( this.length === 0 ) {
    return this;
  }
  while (old_index < 0) {
    old_index += this.length;
  }
  while (new_index < 0) {
    new_index += this.length;
  }
  if (new_index >= this.length) {
    let k = new_index - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this; // for testing purposes
};
