using Microsoft.AspNetCore.SignalR;
using Watcher.Infrastructure;

namespace Watcher.Singletons;

public class PlayerState
{
    private readonly IHubContext<PlayerHub, IPlayerHub> hub;
    public PlayerState(IHubContext<PlayerHub, IPlayerHub> hub)
    {
        this.hub = hub;
        sourceUrl = string.Empty;
    }

    private float volume = 1;
    private bool playing;
    private string sourceUrl;

    public bool GetPlaying => playing;
    public async Task SetPlaying(bool value)
    {
        if (value)
            await hub.Clients.All.Play();
        else if (!value)
            await hub.Clients.All.Pause();
        playing = value;
    }

    public float GetVolume => volume;
    public async Task SetVolume(float value)
    {
        if (value > 1)
            value = 1;
        if (value < 0)
            value = 0;
        await hub.Clients.All.Volume(value);
        volume = value;
    }
    public string GetSourceUrl => sourceUrl;

    public async Task SetSourceUrl(string? value)
    {
        await hub.Clients.All.LoadUrl(value);
        sourceUrl = value ?? string.Empty;
    }

    public async Task RequestOutFullscreen()
        => await hub.Clients.All.RequestOutFullScreen();
}
