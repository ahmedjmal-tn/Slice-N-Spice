using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gestion_Resraurant.DTO.Order;
using Gestion_Resraurant.Models.DTO;
using Gestion_Resraurant.Models.Repository;

namespace Gestion_Resraurant.Models.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<OrderDTO> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return null;

            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                DateCreation = order.DateCreation,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                OrderItems = order.OrderItems?.Select(oi => new OrderItemDTO
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ItemId = oi.ItemId,
                    Quantite = oi.Quantite,
                    PrixUnitaire = oi.PrixUnitaire,
                    DateAjout = oi.DateAjout
                }).ToList()
            };
        }

        public async Task<IEnumerable<OrderDTO>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(order => new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                DateCreation = order.DateCreation,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                OrderItems = order.OrderItems?.Select(oi => new OrderItemDTO
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ItemId = oi.ItemId,
                    Quantite = oi.Quantite,
                    PrixUnitaire = oi.PrixUnitaire,
                    DateAjout = oi.DateAjout
                }).ToList()
            });
        }

        public async Task AddOrderAsync(OrderDTO orderDto)
        {
            var order = new Order
            {
                UserId = orderDto.UserId,
                DateCreation = orderDto.DateCreation,
                PaymentMethod = orderDto.PaymentMethod,
                Status = OrderStatus.Pending, // Assurez-vous que le statut est défini sur Pending lors de la création
                OrderItems = orderDto.OrderItems?.Select(oi => new OrderItem
                {
                    OrderId = oi.OrderId,
                    ItemId = oi.ItemId,
                    Quantite = oi.Quantite,
                    PrixUnitaire = oi.PrixUnitaire,
                    DateAjout = oi.DateAjout
                }).ToList()
            };
            await _orderRepository.AddAsync(order);
        }

        public async Task UpdateOrderAsync(OrderDTO orderDto)
        {
            var order = new Order
            {
                Id = orderDto.Id,
                UserId = orderDto.UserId,
                DateCreation = orderDto.DateCreation,
                PaymentMethod = orderDto.PaymentMethod,
                Status = orderDto.Status,
                OrderItems = orderDto.OrderItems?.Select(oi => new OrderItem
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ItemId = oi.ItemId,
                    Quantite = oi.Quantite,
                    PrixUnitaire = oi.PrixUnitaire,
                    DateAjout = oi.DateAjout
                }).ToList()
            };
            _orderRepository.Update(order);
            await Task.CompletedTask;
        }

        public async Task DeleteOrderAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order != null)
            {
                _orderRepository.Delete(order);
            }
            await Task.CompletedTask;
        }

        public async Task<IEnumerable<OrderDTO>> GetOrdersByUserIdAsync(string userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            return orders.Select(order => new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                DateCreation = order.DateCreation,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                OrderItems = order.OrderItems?.Select(oi => new OrderItemDTO
                {
                    Id = oi.Id,
                    OrderId = oi.OrderId,
                    ItemId = oi.ItemId,
                    Quantite = oi.Quantite,
                    PrixUnitaire = oi.PrixUnitaire,
                    DateAjout = oi.DateAjout
                }).ToList()
            });
        }

        public async Task MarkOrderAsDeliveredAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return;

            order.Status = OrderStatus.Delivered;
            _orderRepository.Update(order);
        }
    }
}