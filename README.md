# Watcher
## _Video player for lazy people_

Self-run video player that can be controlled by phone from the local network (for lazy people)

## Features

- Loading a video from a link (supports all player as [ReactPlayer](https://github.com/CookPete/react-player))
- Change player volume
- Scrolling video
- Play/Pause
- Shutdown PC (Windows only)

## Tech

Watcher uses:

- [React](https://reactjs.org/)
- [ReactPlayer](https://github.com/CookPete/react-player)
- [ReactMUI](https://mui.com/)
- [ASP.NET 6](https://dotnet.microsoft.com/en-us/apps/aspnet)
- [SignalR](https://github.com/SignalR/SignalR)

Most of the communication is between the SignalR hub, so you can control it from wherever you like

## Installation

Required: 
- .NET 6
- Node 16

Simply publish the api locally and run. It works on port 5000 (you can change it in appsettings)
Remember to allow autoplay for the player side to prevent autopause/automute

**It's not a boilerplate or anything like that. I made this in my spare time while learning react**