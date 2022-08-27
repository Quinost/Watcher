import { Slider, styled, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react'
import { forkJoin, tap } from 'rxjs';
import ApiService from '../../core/api.service';
import HubService from '../../core/hub.service';
import Loader from '../Loader/Loader';
import './Remote.css';

interface RemoteState {
    volume: number;
    inputValue: string;
    isLoading: boolean;
    sourceUrl: string;
    duration: number;
    currentTime: number;
    sliderTouched: boolean;
}

const WaterSlider = styled(Slider)({
    '& .MuiSlider-thumb': {
        backgroundColor: '#fff',
    },
    '& .MuiSlider-valueLabel': {
        fontSize: 12,
        padding: 0,
        width: 50,
        height: 50,
        borderRadius: '50% 50% 50% 0',
        transformOrigin: 'bottom left',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

class Remote extends React.Component {
    private apiService: ApiService;
    private hubService: HubService;

    state: Readonly<RemoteState> = {
        volume: 1,
        inputValue: '',
        isLoading: true,
        sourceUrl: '',
        duration: 0,
        currentTime: 0,
        sliderTouched: false
    }

    constructor(props: any) {
        super(props);
        this.apiService = new ApiService();
        this.hubService = new HubService();
        this.mapSubjects();
    }

    private async mapSubjects(): Promise<void> {
        await this.hubService.connect('remote');
        this.hubService.duration$.subscribe(x => {
            if (!this.state.sliderTouched) {
                this.setState({ duration: x.duration, currentTime: x.currentTime })
            }
        });
        forkJoin({
            source: this.apiService.getSourceUrl(),
            volume: this.apiService.getVolume(),
        }).pipe(
            tap(x => {
                this.setState({
                    volume: x.volume,
                    sourceUrl: x.source.url,
                    isLoading: false
                })
            })
        ).subscribe()
    }
    async play(): Promise<void> {
        await this.apiService.play();
    };

    async pause(): Promise<void> {
        await this.apiService.pause();
    };

    async load(): Promise<void> {
        this.setState({ isLoading: true });
        await this.apiService.load(this.state.inputValue)
            .then(x => this.setState({ sourceUrl: x.url }))
            .finally(() => this.setState({ isLoading: false }))
    };

    async handleVolumeChange(vol: number) {
        this.setState({ volume: vol });
        await this.hubService.changeVolume(this.state.volume);
    }

    async changeTime() {
        this.setState({ sliderTouched: false })
        await this.hubService.changeTime(this.state.currentTime);
    }

    async handleOutFullscreen() {
        await this.apiService.requestOutFullscreen();
    }

    timeFormat(value: number) {
        return new Date(value * 1000).toISOString().substr(11, 8);
    }

    render(): React.ReactNode {
        if (this.state.isLoading) {
            return (<Loader />);
        }
        else {
            return (
                <div>
                    <div className='buttons-container'>
                        <TextField id="standard-basic"
                            label="Url"
                            variant="standard"
                            value={this.state.inputValue}
                            onChange={(e) => this.setState({ inputValue: e.target.value })} />
                        <div className='button-row'>
                            <Button className='width-47' variant="outlined" onClick={() => this.play()}>Play</Button>
                            <Button className='width-47' variant="outlined" onClick={() => this.pause()}>Pause</Button>
                        </div>
                        <Button variant="outlined" onClick={() => this.load()}>Load</Button>
                        <span>{this.state.sourceUrl}</span>
                        <div className='slider-div'>
                            <WaterSlider aria-label="Time"
                                min={0}
                                max={this.state.duration}
                                step={0.01}
                                value={this.state.currentTime}
                                valueLabelDisplay={'auto'}
                                valueLabelFormat={e => this.timeFormat(e)}
                                onChange={(_, val) => { this.setState({ currentTime: val }) }}
                                onMouseUp={() => { this.changeTime() }}
                                onMouseDown={() => { this.setState({ sliderTouched: true }) }}
                                onTouchStart={() => { this.setState({ sliderTouched: true }) }}
                                onTouchEnd={() => { this.changeTime() }} />
                        </div>
                        <span>{this.timeFormat(this.state.currentTime)}/{this.timeFormat(this.state.duration)}</span>
                        <div className='slider-div'>
                            <WaterSlider aria-label="Volume"
                                min={0}
                                max={1}
                                step={0.01}
                                value={this.state.volume}
                                valueLabelDisplay={'auto'}
                                valueLabelFormat={e => (e * 100).toFixed(0)}
                                onChange={(_, val) => this.handleVolumeChange(val as number)} />
                        </div>
                        <Button variant="outlined" onClick={() => this.handleOutFullscreen()}>Request out Fullscreen</Button>
                    </div>
                </div>
            );
        }
    };
}

export default Remote;
