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
    public class FoodController : ControllerBase
    {
        private readonly IFoodRepository _foodRepository;
        private readonly ICategorieRepository _categorieRepository;

        public FoodController(IFoodRepository foodRepository, ICategorieRepository categorieRepository)
        {
            _foodRepository = foodRepository;
            _categorieRepository = categorieRepository;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var foods = await _foodRepository.GetAll();
            var foodsDto = foods.Select(f => new FoodDTO { Id = f.Id, Name = f.Name, Price = f.Price, CategorieId = f.CategorieId, ImageUrl = f.ImageUrl }).ToList();
            return Ok(foodsDto);
        }

        [HttpPost]
        public async Task<IActionResult> Ajouter([FromBody] FoodDTO foodDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingFood = await _foodRepository.GetByName(foodDto.Name);
            if (existingFood != null)
            {
                ModelState.AddModelError("Name", "Un food avec ce nom existe déjà.");
                return BadRequest(ModelState);
            }

            var categorie = await _categorieRepository.GetById(foodDto.CategorieId);
            if (categorie == null)
            {
                ModelState.AddModelError("CategorieId", "La catégorie spécifiée est introuvable.");
                return BadRequest(ModelState);
            }

            var food = new Food { Name = foodDto.Name, Price = foodDto.Price, CategorieId = foodDto.CategorieId, ImageUrl = foodDto.ImageUrl };
            var newFood = await _foodRepository.Add(food);

            return CreatedAtAction(nameof(GetById), new { id = newFood.Id }, new FoodDTO { Id = newFood.Id, Name = newFood.Name, Price = newFood.Price, CategorieId = newFood.CategorieId, ImageUrl = newFood.ImageUrl });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var food = await _foodRepository.GetById(id);
            if (food == null)
                return NotFound($"Food avec l'ID {id} introuvable.");

            var foodDto = new FoodDTO { Id = food.Id, Name = food.Name, Price = food.Price, CategorieId = food.CategorieId, ImageUrl = food.ImageUrl };
            return Ok(foodDto);
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] FoodDTO foodDto)
        {
            if (!ModelState.IsValid || foodDto == null)
                return BadRequest("Les données envoyées sont invalides.");

            var categorie = await _categorieRepository.GetById(foodDto.CategorieId);
            if (categorie == null)
            {
                ModelState.AddModelError("CategorieId", "La catégorie spécifiée est introuvable.");
                return BadRequest(ModelState);
            }

            var food = new Food { Id = foodDto.Id, Name = foodDto.Name, Price = foodDto.Price, CategorieId = foodDto.CategorieId, ImageUrl = foodDto.ImageUrl };
            await _foodRepository.Update(food);
            return Ok(foodDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var food = await _foodRepository.GetById(id);
            if (food == null)
                return NotFound($"Food avec l'ID {id} introuvable.");

            await _foodRepository.Delete(id);
            return NoContent();
        }
    }
}