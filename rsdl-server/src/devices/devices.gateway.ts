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

@WebSocketGateway(8001)
export class DevicesGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private raspberryDevices: RaspberryDevice[] = [];

  @SubscribeMessage('raspberry_connect')
  handleMessage(
    @MessageBody() Data: RaspberryConnectDto,
    @ConnectedSocket() client: Socket,
  ): Record<string, unknown> {
    console.log(Data);
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

  @SubscribeMessage('detected_faces')
  handleFaceDetect(@MessageBody() Data: unknown) {
    console.log(Data);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.raspberryDevices = this.raspberryDevices.filter(
      (x) => x.SocketId !== client.id,
    );
    console.log('disconnected id:', client.id);
    console.log(this.raspberryDevices);
  }
}
