namespace Gestion_Resraurant.Models.DTO
{
    public class FoodDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int CategorieId { get; set; }
        public string? ImageUrl { get; set; } // Nouvelle propriété pour l'URL de l'image
    }
}