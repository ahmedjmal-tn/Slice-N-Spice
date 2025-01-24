using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gestion_Resraurant.Migrations
{
    /// <inheritdoc />
    public partial class Cart2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ItemId",
                table: "CartItems",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Foods_ItemId",
                table: "CartItems",
                column: "ItemId",
                principalTable: "Foods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Foods_ItemId",
                table: "CartItems");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_ItemId",
                table: "CartItems");
        }
    }
}
