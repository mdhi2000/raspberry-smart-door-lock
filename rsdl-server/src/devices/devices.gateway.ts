import { HttpStatus } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RaspberryConnectDto } from './Dtos/raspberry-connect.dto';
import { RaspberryDevice } from './interfaces/raspberry-device.interface';
import * as WebSocket from 'ws';

@WebSocketGateway()
export class DevicesGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private raspberryDevices: RaspberryDevice[] = [];

  handleConnection(@ConnectedSocket() client: WebSocket): WsResponse<any> {
    console.log('id:', client.id);
    const raspberryDevice: RaspberryDevice = {
      SerialNumber: '12345',
      SocketId: client.id,
    };
    this.raspberryDevices.push(raspberryDevice);
    console.log(this.raspberryDevices);
    return { event: 'connected', data: 'ok' };
  }

  @SubscribeMessage('raspberry_connect')
  handleMessage(
    @MessageBody() Data: RaspberryConnectDto,
    @ConnectedSocket() client: Socket,
  ): Record<string, unknown> {
    if (Data.SerialNumber) {
      const raspberryDevice: RaspberryDevice = {
        SerialNumber: Data.SerialNumber,
        SocketId: client.id,
      };
      this.raspberryDevices.push(raspberryDevice);
      console.log(this.raspberryDevices);
      return { statusCode: HttpStatus.OK, message: 'connected' };
    }
    return { statusCode: HttpStatus.BAD_REQUEST };
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.raspberryDevices = this.raspberryDevices.filter(
      (x) => x.SocketId !== client.id,
    );
    console.log('disconnected id:', client.id);
    console.log(this.raspberryDevices);
  }
}
