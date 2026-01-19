var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseStaticFiles(); // CHO PHÉP HTML/CSS/JS CHẠY

app.Run();