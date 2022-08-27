using Watcher.Infrastructure;
using Watcher.Singletons;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddSignalR();
builder.Services.AddSingleton<PlayerState>();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<PlayerHub>("/api/playerhub");
});

app.MapFallbackToFile("index.html"); ;

app.Run();
