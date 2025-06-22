
using System.Text;
using backend.Data;
using backend.Filter;
using backend.Interfaces;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using backend.Infrastructure;
using System.Net.WebSockets;
using backend.Hubs;
using StackExchange.Redis;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "e-comerce", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });
    c.OperationFilter<AuthorizeCheckOperationFilter>();
});

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;      // Cho API
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;            // Khi người dùng login
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // Cho Google OAuth
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = "http://localhost:5182"
    };
});
// .AddCookie(options =>
// {
//     options.Cookie.Name = "SchooHealth.Cookie";
//     options.Cookie.HttpOnly = true;
//     options.Cookie.SameSite = SameSiteMode.None;
//     options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
//     options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
//     options.SlidingExpiration = true;
// })
// .AddGoogle(options =>
// {
//     options.ClientId = builder.Configuration["Google:ClientId"];
//     options.ClientSecret = builder.Configuration["Google:ClientSecret"];
//     options.CallbackPath = "/signin-google";
// });



builder.Services.AddAuthorization(option =>
{
    option.AddPolicy("AdminOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("Admin");
    });
    option.AddPolicy("NurseOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("Nurse");
    });
    option.AddPolicy("ParentOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole("Parent");
    });

});

builder.Services.AddCors(options =>
{
    // options.AddPolicy("AllowSpecificOrigins",
    //     builder =>
    //     {
    //         builder
    //             .WithOrigins("http://127.0.0.1:5501") // URL của frontend
    //             .AllowAnyMethod()
    //             .AllowAnyHeader()
    //             .AllowCredentials();
    //     });

    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000") // 👈 Đúng với React dev server
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // 👈 Chỉ cần nếu dùng cookie
    });
});

// Cấu hình Authentication Google + Cookie
// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
// })
// .AddCookie(options =>
// {
//     options.Cookie.Name = "SchooHealth.Cookie";
//     options.Cookie.HttpOnly = true;
//     options.Cookie.SameSite = SameSiteMode.None;
//     options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
//     options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
//     options.SlidingExpiration = true;
// })
// .AddGoogle(options =>
// {
//     options.ClientId = builder.Configuration["Google:ClientId"];
//     options.ClientSecret = builder.Configuration["Google:ClientSecret"];
//     options.CallbackPath = "/signin-google";
// });
// builder.Services.AddSingleton<backend.Infrastructure.WebSocketManager>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<FileUploadSettings>(
builder.Configuration.GetSection("FileUploadSettings"));
builder.Services.AddSingleton(resolver =>
    resolver.GetRequiredService<IOptions<FileUploadSettings>>().Value);

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IHealthCheckService, HealthCheckService>();
builder.Services.AddScoped<IHealthCheckRepository, HealthCheckRepository>();
builder.Services.AddScoped<IVaccinationRepository, VaccinationRepository>();
builder.Services.AddScoped<IVaccinationService, VaccinationService>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IBlogPostService, BlogPostService>();
builder.Services.AddScoped<IBlogPostRepository, BlogPostRepository>();
builder.Services.AddScoped<IStudentProfileRepository, StudentProfileRepository>();
builder.Services.AddScoped<IStudentProfileService, StudentProfileService>();
builder.Services.AddScoped<IMedicationRepository, MedicationRepository>();
builder.Services.AddScoped<INotificationStudentRepository, NotificationStudentRepository>();
builder.Services.AddScoped<INotificationStudentService, NotificationStudentService>();
builder.Services.AddScoped<IMedicationService, MedicationService>();
builder.Services.AddScoped<IMedicalEventService, MedicalEventService>();
builder.Services.AddScoped<IMedicalEventRepository, MedicalEventRepository>();
builder.Services.AddScoped<IMedicalEventSupplyService, MedicalEventSupplyService>();
builder.Services.AddScoped<IMedicalEventSupplyRepository, MedicalEventSupplyRepository>();
builder.Services.AddScoped<IMedicalSupplyRepository, MedicalSupplyRepository>();
builder.Services.AddScoped<IMedicalSupplyService, MedicalSupplyService>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IHomeService, HomeService>();
builder.Services.AddScoped<IExcelService, ExcelService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IClassRepository, ClassRepository>();
builder.Services.AddScoped<IClassService, ClassService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IRedisService, RedisService>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configString = builder.Configuration.GetConnectionString("Redis");
    var config = ConfigurationOptions.Parse(configString);
    config.AbortOnConnectFail = false;
    return ConnectionMultiplexer.Connect(config);
});
builder.Services.AddSignalR();





var app = builder.Build();
app.MapHub<NotificationHub>("/notificationHub");
app.MapHub<ChatHub>("/chatHub");
// app.UseWebSockets(); // 👈 Bật WebSocket
// var socketManager = app.Services.GetRequiredService<backend.Infrastructure.WebSocketManager>();

// app.Map("/ws", async (Microsoft.AspNetCore.Http.HttpContext context) =>
// {
//     if (context.Request.Query.TryGetValue("userId", out var userIdStr) && int.TryParse(userIdStr, out var userId))
//     {
//         if (context.WebSockets.IsWebSocketRequest)
//         {
//             var socket = await context.WebSockets.AcceptWebSocketAsync();
//             socketManager.Add(userId, socket); 

//             while (socket.State == WebSocketState.Open)
//             {
//                 await Task.Delay(1000);
//             }

//             socketManager.Remove(userId);
//             return;
//         }
//     }

//     context.Response.StatusCode = 400;
// });


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var uploadsPath = Path.Combine(builder.Environment.WebRootPath, "uploads");

if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseCookiePolicy();
// app.UseCors();
app.UseCors("AllowFrontend"); // 👈 Áp dụng policy đã khai báo ở trên


// app.UseHttpsRedirection();

app.UseCookiePolicy();            // 👈 Phải có để xử lý SameSite
app.UseCors();                    // 👈 Bật CORS
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseAuthentication();         // 👈 Quan trọng: phải trước MapControllers
app.UseAuthorization();
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
