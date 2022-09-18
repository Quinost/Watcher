import axios from "axios";
import { BaseUrl } from "./http-common";
import { UrlRequestResponse } from "./models";

export class ApiService {
    apiUrl: string;
    constructor() {
        this.apiUrl = BaseUrl + "player/";
    }

    async play(): Promise<void> {
        return (await axios.post<void>(this.apiUrl + 'play')).data;
    }

    async pause(): Promise<void> {
        return (await axios.post<void>(this.apiUrl + 'pause')).data;
    }

    async requestOutFullscreen(): Promise<void> {
        return (await axios.post<void>(this.apiUrl + 'request-out-fullscreen')).data;
    }

    async load(url: string): Promise<UrlRequestResponse> {
        return (await axios.post<UrlRequestResponse>(this.apiUrl + 'load', { url: url })).data;
    }

    async getSourceUrl(): Promise<UrlRequestResponse> {
        return (await axios.get<UrlRequestResponse>(this.apiUrl + 'source-url')).data;
    }

    async getVolume(): Promise<number> {
        return (await axios.get<number>(this.apiUrl + 'volume')).data;
    }

    async shutdownWindows(): Promise<void> {
        return (await axios.post<void>(this.apiUrl + 'shutdown-windows')).data;
    }
}

export default ApiService;