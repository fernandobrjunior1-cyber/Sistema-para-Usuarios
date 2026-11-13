
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SistemaUsuariosAPI.Models;

namespace SistemaUsuariosAPI.Services;

public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GerarToken(Usuario usuario)
    {
        var chave = _configuration["Jwt:Key"]!;

        var credenciais = new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(chave)
            ),
            SecurityAlgorithms.HmacSha256
        );

        var claims = new List<Claim>
        {
            new Claim(
                JwtRegisteredClaimNames.Sub,
                usuario.Id.ToString()
            ),
            new Claim("name", usuario.Nome),
            new Claim("role", usuario.Perfil)
        };

        var minutos = int.Parse(
            _configuration["Jwt:ExpiresMinutes"] ?? "60"
        );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(minutos),
            signingCredentials: credenciais
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}
