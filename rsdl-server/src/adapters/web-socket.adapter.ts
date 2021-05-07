import { WebSocketAdapter, INestApplicationContext } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';

export class WsAdapter implements WebSocketAdapter {
  constructor(private app: INestApplicationContext) {}

  create(port: number, options: any = {}): any {
    return new Server(port, { ...options });
  }

  bindClientConnect(server, callback: Function) {
    server.on('connection', callback);
  }

  bindMessageHandlers(
    client: Socket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    for (const handler of handlers) {
      // console.log(handler);
      client.on(handler.message, handler.callback);
    }
    // fromEvent(client, 'message')
    //   .pipe(
    //     mergeMap((data) => this.bindMessageHandler(data, handlers, process)),
    //     filter((result) => result),
    //   )
    //   .subscribe((response) => client.send(JSON.stringify(response)));
  }

  // bindMessageHandler(
  //   buffer,
  //   handlers: MessageMappingProperties[],
  //   process: (data: any) => Observable<any>,
  // ): Observable<any> {
  //   const message = JSON.parse(buffer.data);
  //   console.log(message);
  //   const messageHandler = handlers.find(
  //     (handler) => handler.message === message.event,
  //   );
  //   if (!messageHandler) {
  //     return EMPTY;
  //   }
  //   return process(messageHandler.callback(message.data));
  // }

  bindClientDisconnect(server, callback: Function) {
    server.on('disconnect', callback);
  }

  close(server) {
    server.close();
  }
}
