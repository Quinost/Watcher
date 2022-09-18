import React from 'react'
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player'
import ApiService from '../../core/api.service';
import HubService from '../../core/hub.service';
import screenfull from 'screenfull'
import './Player.css'
import { forkJoin, tap } from 'rxjs';
import Button from '@mui/material/Button';

export interface PlayerState {
    play: boolean;
    volume: number;
    url: string;
    duration: number;
}

// https://www.npmjs.com/package/react-player#standalone-player

class Player extends React.Component {
    private apiService: ApiService;
    private hubService: HubService;

    state: Readonly<PlayerState> = {
        play: false,
        volume: 1,
        url: '',
        duration: 0,
    }

    player!: ReactPlayer | null;

    constructor(props: any) {
        super(props);
        this.apiService = new ApiService();
        this.hubService = new HubService();
        this.mapSubjects();
    }

    private async mapSubjects(): Promise<void> {
        await this.hubService.connect('player');
        this.hubService.play$.subscribe(() => this.setState({ play: true }));
        this.hubService.pause$.subscribe(() => this.setState({ play: false }));
        this.hubService.volume$.subscribe(vol => this.setState({ volume: vol }))
        this.hubService.loadMedia$.subscribe(url => { this.setState({ url: url, play: true }); })
        this.hubService.changeTime$.subscribe(time => { this.player?.seekTo(time, 'seconds'); })
        this.hubService.requestOutFullScreen$.subscribe(async () => await screenfull.exit())
        forkJoin({
            source: this.apiService.getSourceUrl(),
            volume: this.apiService.getVolume()
        }).pipe(
            tap(x => {
                this.setState({ volume: x.volume, url: x.source.url })
            })
        ).subscribe();
    }

    handleProgress(val: number) {
        const isInifity = this.state.duration === Infinity ? true : false;
        this.hubService.progressUpdate({ duration: isInifity ? 0 : this.state.duration, currentTime: val, infinity: isInifity })
    }

    handleFullScreen(): void {
        screenfull.request(findDOMNode(this.player) as Element)
    }

    render(): React.ReactNode {
        return (
            <div>
                <Button className='fullwidth-btn' variant="outlined" href='remote'>Remote</Button>
                <ReactPlayer
                    playing={this.state.play}
                    ref={player => this.player = player}
                    volume={this.state.volume}
                    muted={false}
                    url={this.state.url}
                    playsinline={true}
                    onDuration={duration => this.setState({ duration: duration })}
                    onProgress={e => this.handleProgress(e.playedSeconds)} />
                <Button className='fullwidth-btn' variant="outlined" onClick={() => this.handleFullScreen()}>Fullscreen</Button>
                <p>Remember to allow autoplay for this website</p>
            </div>
        );
    };
}

export default Player;
