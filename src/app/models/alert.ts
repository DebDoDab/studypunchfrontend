export class Alert {
  type: string;
  message: string;
  state: boolean;

  constructor() {
    this.type = 'danger';
    this.message = '';
    this.state = false;
  }

  set(message: string, type: string) {
    this.message = message;
    this.state = !!message;
    this.type = type;
  }

  clear() {
    this.message = '';
    this.state = false;
  }
}
