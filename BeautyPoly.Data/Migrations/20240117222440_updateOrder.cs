using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class updateOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PurchaseMethod",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PurchaseMethod",
                table: "Orders");
        }
    }
}
