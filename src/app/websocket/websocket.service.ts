import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";

const WEBSOCKET_URL = "ws://localhost:8000/websocket/";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    subject = null;

    constructor() {}

    connect(group_id: number) {
        if (!this.subject) {
            this.subject = webSocket(WEBSOCKET_URL + group_id + '/');
        }
        return this.subject;
    }
}
