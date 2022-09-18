import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Subject } from "rxjs";
import { BaseUrl } from "./http-common";
import { DurationRequestResponse } from "./models";

export class HubService {
    public play$!: Subject<void>;
    public pause$!: Subject<void>;
    public loadMedia$!: Subject<string>;
    public requestOutFullScreen$!: Subject<void>;
    public volume$!: Subject<number>;
    public duration$!: Subject<DurationRequestResponse>;
    public changeTime$!: Subject<number>;

    private hubConnection!: HubConnection;
    private apiUrl: string = '';

    constructor() {
        this.apiUrl = BaseUrl + 'playerhub';
    }

    async connect(whichPage: 'player' | 'remote'): Promise<void> {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.apiUrl + `?username=` + whichPage)
            .withAutomaticReconnect()
            .build();
        await this.hubConnection
            .start()
            .then(() => {
                console.log('Connection started')
            })
            .catch(err => console.log('Error while starting connection: ' + err))

        if (whichPage === 'player')
            this.playerEvents();
        else if (whichPage === 'remote')
            this.remoteEvents();
    }

    private playerEvents(): void {
        this.play$ = new Subject();
        this.pause$ = new Subject();
        this.loadMedia$ = new Subject();
        this.requestOutFullScreen$ = new Subject();
        this.volume$ = new Subject();
        this.changeTime$ = new Subject();

        this.hubConnection.on('Play', _ => {
            console.log('Play');
            this.play$.next()
        });
        this.hubConnection.on('Pause', _ => {
            console.log('Pause');
            this.pause$.next()
        });
        this.hubConnection.on('LoadUrl', url => {
            console.log('LoadUrl', url);
            this.loadMedia$.next(url)
        });
        this.hubConnection.on('RequestOutFullScreen', _ => {
            console.log('RequestOutFullScreen');
            this.requestOutFullScreen$.next()
        });
        this.hubConnection.on('Volume', x => {
            console.log('Volume: ' + x);
            this.volume$.next(x);
        });
        this.hubConnection.on('ChangeTime', x => {
            console.log('ChangeTime: ' + x);
            this.changeTime$.next(x);
        });
    }

    private remoteEvents(): void {
        this.duration$ = new Subject();

        this.hubConnection.on('Duration', x => {
            this.duration$.next(x);
        });
    }

    async changeVolume(volume: number): Promise<void> {
        await this.hubConnection?.invoke('Volume', volume);
    }

    async changeTime(time: number): Promise<void> {
        await this.hubConnection?.invoke('ChangeTime', time);
    }

    async progressUpdate(duration: DurationRequestResponse): Promise<void> {
        await this.hubConnection?.invoke('Duration', duration);
    }
}

export default HubService;