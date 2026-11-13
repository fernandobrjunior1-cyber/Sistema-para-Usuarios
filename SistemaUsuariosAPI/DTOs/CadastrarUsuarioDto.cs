
using System.ComponentModel.DataAnnotations;

namespace SistemaUsuariosAPI.DTOs;

public class CadastrarUsuarioDto
{
    [Required]
    [MinLength(3)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Senha { get; set; } = string.Empty;
}
