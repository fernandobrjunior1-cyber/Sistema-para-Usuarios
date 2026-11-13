
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaUsuariosAPI.Data;
using SistemaUsuariosAPI.DTOs;
using SistemaUsuariosAPI.Models;
using SistemaUsuariosAPI.Services;
using Microsoft.AspNetCore.Authorization;

namespace SistemaUsuariosAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;
    private readonly IPasswordHasher<Usuario> _passwordHasher;

    
public UsuariosController(
    AppDbContext context,
    IPasswordHasher<Usuario> passwordHasher,
    TokenService tokenService)
{
    _context = context;
    _passwordHasher = passwordHasher;
    _tokenService = tokenService;
}
 


[Authorize]
[HttpGet("me")]
public IActionResult MeuPerfil()
{
    return Ok(new
    {
        mensagem = "Token válido!",
        nome = User.FindFirst("name")?.Value,
        perfil = User.FindFirst("role")?.Value
    });
}


    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar(
        [FromBody] CadastrarUsuarioDto dto)
    {
        var nome = dto.Nome.Trim();
        var email = dto.Email.Trim().ToLowerInvariant();

        if (nome.Length < 3)
        {
            return BadRequest(new
            {
                mensagem = "O nome deve ter pelo menos 3 caracteres."
            });
        }

        var emailExiste = await _context.Usuarios
            .AnyAsync(u => u.Email == email);

        if (emailExiste)
        {
            return Conflict(new
            {
                mensagem = "Este e-mail já está cadastrado."
            });
        }

        var usuario = new Usuario
        {
            Nome = nome,
            Email = email,
            Perfil = "Usuario"
        };

        // Nunca armazenar a senha original
        usuario.SenhaHash = _passwordHasher.HashPassword(
            usuario,
            dto.Senha
        );

        _context.Usuarios.Add(usuario);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // O índice único também protege contra
            // cadastros simultâneos do mesmo e-mail.
            if (await _context.Usuarios
                .AsNoTracking()
                .AnyAsync(u => u.Email == email))
            {
                return Conflict(new
                {
                    mensagem = "Este e-mail já está cadastrado."
                });
            }

            throw;
        }

        return StatusCode(201, new
        {
            mensagem = "Usuário cadastrado com sucesso!",
            usuario = new
            {
                usuario.Id,
                usuario.Nome,
                usuario.Email,
                usuario.Perfil
            }
        });
    }


[Authorize(Roles = "Administrador")]
[HttpGet("administracao")]
public async Task<IActionResult> ListarUsuarios()
{
    var usuarios = await _context.Usuarios
        .AsNoTracking()
        .OrderBy(u => u.Nome)
        .Select(u => new
        {
            u.Id,
            u.Nome,
            u.Email,
            u.Perfil
        })
        .ToListAsync();

    return Ok(usuarios);
}



[HttpPost("login")]
public async Task<IActionResult> Login(
    [FromBody] LoginDto dto)
{
    var email = dto.Email.Trim().ToLowerInvariant();

    // Procurar usuário no SQL Server
    var usuario = await _context.Usuarios
        .FirstOrDefaultAsync(u => u.Email == email);

    if (usuario == null)
    {
        return Unauthorized(new
        {
            mensagem = "E-mail ou senha inválidos."
        });
    }

    // Verificar a senha contra o hash salvo
    var resultado = _passwordHasher.VerifyHashedPassword(
        usuario,
        usuario.SenhaHash,
        dto.Senha
    );

    if (resultado == PasswordVerificationResult.Failed)
    {
        return Unauthorized(new
        {
            mensagem = "E-mail ou senha inválidos."
        });
    }

    // Login válido
    
var token = _tokenService.GerarToken(usuario);

return Ok(new
{
    mensagem = "Login realizado com sucesso!",
    token,
    usuario = new
    {
        usuario.Id,
        usuario.Nome,
        usuario.Email,
        usuario.Perfil
    }


});

}

}
