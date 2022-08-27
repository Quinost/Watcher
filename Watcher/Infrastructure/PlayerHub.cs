using Microsoft.AspNetCore.SignalR;
using Watcher.Singletons;

namespace Watcher.Infrastructure;

public record Time(float Duration, float CurrentTime);
public interface IPlayerHub
{
    Task Play();
    Task Pause();
    Task LoadUrl(string? url);
    Task Volume(float volume);
    Task Duration(Time time);
    Task ChangeTime(float time);
    Task RequestOutFullScreen();
}

public class PlayerHub : Hub<IPlayerHub>
{
    private readonly PlayerState state;

    public PlayerHub(PlayerState state)
        => this.state = state;

    public async Task ChangeTime(float time) 
        => await Clients.All.ChangeTime(time);

    public async Task Duration(Time time) 
        => await Clients.All.Duration(time);

    public async Task Volume(float volume)
        => await state.SetVolume(volume);
}
