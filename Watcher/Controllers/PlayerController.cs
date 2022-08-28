using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Watcher.Singletons;

namespace Watcher.Controllers;
[Route("api/player")]
[ApiController]
public class PlayerController : ControllerBase
{
    public record UrlResponseRequest(string? Url);

    private readonly PlayerState state;

    public PlayerController(PlayerState state)
    {
        this.state = state;
    }

    [HttpGet("source-url")]
    public IActionResult GetSourceUrl()
    {
        return Ok(new UrlResponseRequest(state.GetSourceUrl));
    }

    [HttpGet("volume")]
    public IActionResult GetVolume()
    {
        return Ok(state.GetVolume);
    }

    [HttpPost("play")]
    public async Task PlayVideo()
    {
        await state.SetPlaying(true);
    }

    [HttpPost("pause")]
    public async Task PauseVideo()
    {
        await state.SetPlaying(false);
    }

    [HttpPost("load")]
    public async Task<IActionResult> LoadMedia([FromBody] UrlResponseRequest url)
    {
        if (string.IsNullOrEmpty(url.Url))
            return Ok(new UrlResponseRequest("No link to load"));

        await state.SetPlaying(false);
        await state.SetSourceUrl(url.Url);
        return Ok(new UrlResponseRequest(state.GetSourceUrl));
    }

    [HttpPost("request-out-fullscreen")]
    public async Task RequestOutFullscreen()
    {
        await state.RequestOutFullscreen();
    }

    [HttpPost("shutdown-windows")]
    public void ShutdownWindows()
    {
        Process.Start("shutdown", "/s /t 0");
    }
}

