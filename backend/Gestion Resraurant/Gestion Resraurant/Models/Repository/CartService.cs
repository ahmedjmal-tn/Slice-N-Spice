using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gestion_Resraurant.DTO.Cart;
using Gestion_Resraurant.Models.DTO;
using Gestion_Resraurant.Models.Repository;

namespace Gestion_Resraurant.Models.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly ICartItemRepository _cartItemRepository;

        public CartService(ICartRepository cartRepository, ICartItemRepository cartItemRepository)
        {
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
        }

        public async Task<CartDTO> GetCartByIdAsync(int id)
        {
            var cart = await _cartRepository.GetByIdAsync(id);
            if (cart == null) return null;

            return new CartDTO
            {
                Id = cart.Id,
                UserId = cart.UserId,
                DateCreation = cart.DateCreation,
                CartItems = cart.CartItems?.Select(ci => new CartItemDTO
                {
                    Id = ci.Id,
                    CartId = ci.CartId,
                    ItemId = ci.ItemId,
                    Quantite = ci.Quantite,
                    PrixUnitaire = ci.PrixUnitaire,
                    DateAjout = ci.DateAjout,
                   
                }).ToList()
            };
        }

        public async Task<IEnumerable<CartDTO>> GetAllCartsAsync()
        {
            var carts = await _cartRepository.GetAllAsync();
            return carts.Select(cart => new CartDTO
            {
                Id = cart.Id,
                UserId = cart.UserId,
                DateCreation = cart.DateCreation,
                CartItems = cart.CartItems?.Select(ci => new CartItemDTO
                {
                    Id = ci.Id,
                    CartId = ci.CartId,
                    ItemId = ci.ItemId,
                    Quantite = ci.Quantite,
                    PrixUnitaire = ci.PrixUnitaire,
                    DateAjout = ci.DateAjout,
                   
                }).ToList()
            });
        }

        public async Task AddCartAsync(CartDTO cartDto)
        {
            var cart = new Cart
            {
                UserId = cartDto.UserId,
                DateCreation = cartDto.DateCreation,
                CartItems = cartDto.CartItems?.Select(ci => new CartItem
                {
                    CartId = ci.CartId,
                    ItemId = ci.ItemId,
                    Quantite = ci.Quantite,
                    PrixUnitaire = ci.PrixUnitaire,
                    DateAjout = ci.DateAjout
                }).ToList()
            };
            await _cartRepository.AddAsync(cart);
        }

        public async Task UpdateCartAsync(CartDTO cartDto)
        {
            var cart = new Cart
            {
                Id = cartDto.Id,
                UserId = cartDto.UserId,
                DateCreation = cartDto.DateCreation,
                CartItems = cartDto.CartItems?.Select(ci => new CartItem
                {
                    Id = ci.Id,
                    CartId = ci.CartId,
                    ItemId = ci.ItemId,
                    Quantite = ci.Quantite,
                    PrixUnitaire = ci.PrixUnitaire,
                    DateAjout = ci.DateAjout
                }).ToList()
            };
            _cartRepository.Update(cart);
            await Task.CompletedTask;
        }

        public async Task DeleteCartAsync(int id)
        {
            var cart = await _cartRepository.GetByIdAsync(id);
            if (cart != null)
            {
                _cartRepository.Delete(cart);
            }
            await Task.CompletedTask;
        }

        public async Task<CartDTO> GetCartByUserIdAsync(string userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);
            if (cart == null) return null;

            return new CartDTO
            {
                Id = cart.Id,
                UserId = cart.UserId,
                DateCreation = cart.DateCreation,
                CartItems = cart.CartItems?.Select(ci => new CartItemDTO
                {
                    Id = ci.Id,
                    CartId = ci.CartId,
                    ItemId = ci.ItemId,
                    Quantite = ci.Quantite,
                    PrixUnitaire = ci.PrixUnitaire,
                    DateAjout = ci.DateAjout,
                   
                }).ToList()
            };
        }

        public async Task UpdateCartItemQuantityAsync(int cartItemId, int quantity)
        {
            await _cartItemRepository.UpdateQuantityAsync(cartItemId, quantity);
        }

        public async Task DeleteCartItemAsync( int cartItemId)
        {
            await _cartItemRepository.DeleteByCartIdAsync(cartItemId);
        }
            public async Task AddFoodToCartAsync(int cartId, int foodId, int quantity)
    {
        var cart = await _cartRepository.GetByIdAsync(cartId);
        if (cart == null)
        {
            throw new Exception("Cart not found");
        }

        var cartItem = new CartItem
        {
            CartId = cartId,
            ItemId = foodId,
            Quantite = quantity,
            PrixUnitaire = 0, // Assurez-vous de définir le prix unitaire approprié
            DateAjout = DateTime.Now
        };

        await _cartItemRepository.AddAsync(cartItem);
    }
    }
}