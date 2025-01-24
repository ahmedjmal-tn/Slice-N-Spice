using E_Training.DTO;
using Gestion_Resraurant.DTO.Cart;
using Gestion_Resraurant.Models;
using Gestion_Resraurant.Models.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Gestion_Resraurant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ICartService _cartService;

        public AccountController(UserManager<ApplicationUser> userManager, IConfiguration configuration, ICartService cartService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _cartService = cartService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDTO registerDTO)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser appUser = new()
                {
                    UserName = registerDTO.Email,
                    Email = registerDTO.Email,
                    Nom = registerDTO.Nom,
                    Prenom = registerDTO.Prenom
                };

                IdentityResult result = await _userManager.CreateAsync(appUser, registerDTO.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(appUser, "Client");

                    // Create an empty cart for the new user
                    CartDTO newCart = new CartDTO
                    {
                        UserId = appUser.Id
                    };
                    await _cartService.AddCartAsync(newCart);

                    return Ok("success");
                }
                else
                {
                    ModelState.AddModelError("Erreur", "Problème de création d'utilisateur");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await _userManager.FindByNameAsync(loginDTO.Email);
                if (user != null)
                {
                    if (await _userManager.CheckPasswordAsync(user, loginDTO.Password))
                    {
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, user.UserName),
                            new Claim(ClaimTypes.NameIdentifier, user.Id),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                        };

                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
                        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                        var token = new JwtSecurityToken(
                            issuer: _configuration["JWT:Issuer"],
                            audience: _configuration["JWT:Audience"],
                            claims: claims,
                            expires: DateTime.Now.AddHours(1),
                            signingCredentials: creds
                        );

                        var roles = await _userManager.GetRolesAsync(user);
                        var userDTO = new NewUserDTO
                        {
                            Email = user.Email,
                            Nom = user.Nom,
                            Prenom = user.Prenom,
                            Role = roles.FirstOrDefault(), // Assuming a single role per user
                            Id = user.Id // Ajouter l'ID de l'utilisateur ici
                        };

                        var response = new
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            expiration = token.ValidTo,
                            user = userDTO
                        };

                        return Ok(response);
                    }
                    else
                    {
                        ModelState.AddModelError("Erreur", "Utilisateur n'est pas autorisé à se connecter");
                        return Unauthorized(ModelState);
                    }
                }
                return BadRequest(ModelState);
            }
            return BadRequest(ModelState);
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            // Invalidate the user's session or token here if necessary
            return Ok("Logged out successfully");
        }

        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDTOs = new List<NewUserDTO>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDTOs.Add(new NewUserDTO
                {
                    Email = user.Email,
                    Password = user.PasswordHash, // Note: It's not recommended to expose password hashes
                    Nom = user.Nom,
                    Prenom = user.Prenom,
                    Role = roles.FirstOrDefault() // Assuming a single role per user
                });
            }

            return Ok(userDTOs);
        }

        [HttpGet("GetCurrentUser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userDTO = new NewUserDTO
            {
                Email = user.Email,
                Nom = user.Nom,
                Prenom = user.Prenom,
                Role = roles.FirstOrDefault() // Assuming a single role per user
            };

            return Ok(userDTO);
        }
        [HttpGet("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userDTO = new
            {
                Nom = user.Nom,
                Prenom = user.Prenom
            };

            return Ok(userDTO);
        }
    }
}