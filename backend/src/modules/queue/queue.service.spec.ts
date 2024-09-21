import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('QueueService', () => {
    let service: QueueService;
    let clientProxy: ClientProxy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QueueService,
                {
                    provide: 'REDIS_QUEUE_CLIENT',
                    useValue: {
                        send: jest.fn().mockImplementation(() => of({})),
                    },
                },
            ],
        }).compile();

        service = module.get<QueueService>(QueueService);
        clientProxy = module.get<ClientProxy>('REDIS_QUEUE_CLIENT');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should send a message', async () => {
        const payload = { id: 1 };
        await service.send(payload);
        expect(clientProxy.send).toHaveBeenCalledWith('verdict', JSON.stringify({
            payload,
            options: {
                persistent: true,
                contentType: 'application/json',
            },
        }));
    });
});