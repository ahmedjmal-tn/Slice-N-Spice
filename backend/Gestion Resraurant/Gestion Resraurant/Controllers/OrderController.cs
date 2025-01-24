using Gestion_Resraurant.DTO.Order;
using Gestion_Resraurant.Models.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound();
        }
        return Ok(order);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        var orders = await _orderService.GetOrdersByUserIdAsync(userId);
        if (orders == null || !orders.Any())
        {
            return NotFound();
        }
        return Ok(orders);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] OrderDTO orderDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        await _orderService.AddOrderAsync(orderDto);
        return CreatedAtAction(nameof(GetById), new { id = orderDto.Id }, orderDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] OrderDTO orderDto)
    {
        if (id != orderDto.Id || !ModelState.IsValid)
        {
            return BadRequest();
        }
        await _orderService.UpdateOrderAsync(orderDto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _orderService.DeleteOrderAsync(id);
        return NoContent();
    }

    [HttpPut("{id}/deliver")]
    public async Task<IActionResult> MarkAsDelivered(int id)
    {
        await _orderService.MarkOrderAsDeliveredAsync(id);
        return NoContent();
    }
}