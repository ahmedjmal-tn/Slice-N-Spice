using Gestion_Resraurant.DTO.Cart;
using Gestion_Resraurant.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var carts = await _cartService.GetAllCartsAsync();
        return Ok(carts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cart = await _cartService.GetCartByIdAsync(id);
        if (cart == null)
        {
            return NotFound();
        }
        return Ok(cart);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        var cart = await _cartService.GetCartByUserIdAsync(userId);
        if (cart == null)
        {
            return NotFound();
        }
        return Ok(cart);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] CartDTO cartDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        await _cartService.AddCartAsync(cartDto);
        return CreatedAtAction(nameof(GetById), new { id = cartDto.Id }, cartDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CartDTO cartDto)
    {
        if (id != cartDto.Id || !ModelState.IsValid)
        {
            return BadRequest();
        }
        await _cartService.UpdateCartAsync(cartDto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _cartService.DeleteCartAsync(id);
        return NoContent();
    }

    [HttpPut("item/{cartItemId}/quantity")]
    public async Task<IActionResult> UpdateCartItemQuantity(int cartItemId, [FromBody] int quantity)
    {
        if (quantity < 0)
        {
            return BadRequest("Quantity cannot be negative.");
        }
        await _cartService.UpdateCartItemQuantityAsync(cartItemId, quantity);
        return NoContent();
    }

[HttpDelete("item/{cartItemId}")]
public async Task<IActionResult> DeleteCartItem(int cartItemId)
{
    await _cartService.DeleteCartItemAsync(cartItemId);
    return NoContent();
}
    [HttpPost("{cartId}/item")]
    public async Task<IActionResult> AddFoodToCart(int cartId, [FromBody] AddFoodToCartDTO addFoodToCartDto)
    {
        if (addFoodToCartDto.Quantity <= 0)
        {
            return BadRequest("Quantity must be greater than zero.");
        }

        await _cartService.AddFoodToCartAsync(cartId, addFoodToCartDto.FoodId, addFoodToCartDto.Quantity);
        return NoContent();
    }
}