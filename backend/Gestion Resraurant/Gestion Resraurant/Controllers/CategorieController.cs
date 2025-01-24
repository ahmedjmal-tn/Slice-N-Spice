using Microsoft.AspNetCore.Mvc;
using Gestion_Resraurant.Models;
using Gestion_Resraurant.Models.DTO;
using Gestion_Resraurant.Models.Repository;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Gestion_Resraurant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategorieController : ControllerBase
    {
        private readonly ICategorieRepository repository;

        public CategorieController(ICategorieRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await repository.GetAll();
            var categoriesDto = categories.Select(c => new CategorieDTO { Id = c.Id, Name = c.Name }).ToList();
            return Ok(categoriesDto);
        }

        [HttpPost]
        public async Task<IActionResult> Ajouter(CategorieDTO categorieDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingCategorie = await repository.GetByName(categorieDto.Name);
            if (existingCategorie != null)
            {
                ModelState.AddModelError("", "Categorie existante");
                return BadRequest(ModelState);
            }

            var categorie = new Categorie { Name = categorieDto.Name };
            var newCategorie = await repository.Add(categorie);

            return CreatedAtAction("GetByID", new { id = newCategorie.Id }, new CategorieDTO { Id = newCategorie.Id, Name = newCategorie.Name });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            var categorie = await repository.GetById(id);
            if (categorie == null)
            {
                return BadRequest("Categorie inexistante");
            }
            var categorieDto = new CategorieDTO { Id = categorie.Id, Name = categorie.Name };
            return Ok(categorieDto);
        }
        [Authorize]
        [HttpGet("{id}/with-foods")]
        public async Task<IActionResult> GetByIdWithFoods(int id)
        {
            var categorie = await repository.GetByIdWithFoods(id);
            if (categorie == null)
            {
                return NotFound($"Categorie avec l'ID {id} introuvable.");
            }

            var categorieDto = new CategorieDTO
            {
                Id = categorie.Id,
                Name = categorie.Name
            };

            var foodsDto = categorie.Foods?.Select(f => new FoodDTO
            {
                Id = f.Id,
                Name = f.Name,
                Price = f.Price,
                CategorieId = f.CategorieId,
                ImageUrl = f.ImageUrl // Assurez-vous que l'URL de l'image est incluse
            }).ToList();

            return Ok(new { Categorie = categorieDto, Foods = foodsDto });
        }

        [HttpPut]
        public async Task<IActionResult> Edit(CategorieDTO categorieDto)
        {
            if (categorieDto == null)
            {
                return BadRequest("Objet non valide");
            }
            var categorie = new Categorie { Id = categorieDto.Id, Name = categorieDto.Name };
            await repository.Update(categorie);
            return Ok(categorieDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await repository.Delete(id);
            return NoContent();
        }
    }
}