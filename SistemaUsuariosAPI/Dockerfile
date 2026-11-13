
# ETAPA 1 - Compilar a API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore "SistemaUsuariosAPI.csproj"

RUN dotnet publish "SistemaUsuariosAPI.csproj" -c Release -o /app/publish --no-restore

# ETAPA 2 - Executar a API
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "SistemaUsuariosAPI.dll"]
