using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class updatecate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_ParentID",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryCateId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "SaleItemCategories");

            migrationBuilder.DropTable(
                name: "SaleItemProducts");

            migrationBuilder.DropIndex(
                name: "IX_Categories_ParentID",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "OriginalPrice",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "SalePrice",
                table: "SaleItems");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "IsSale",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Categories");

            migrationBuilder.RenameColumn(
                name: "CategoryCateId",
                table: "Products",
                newName: "CateID");

            migrationBuilder.RenameIndex(
                name: "IX_Products_CategoryCateId",
                table: "Products",
                newName: "IX_Products_CateID");

            migrationBuilder.RenameColumn(
                name: "CateId",
                table: "Categories",
                newName: "CateID");

            migrationBuilder.AddColumn<double>(
                name: "ReceiveCustomerMoney",
                table: "Orders",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ReturnCustomerMoney",
                table: "Orders",
                type: "float",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CateName",
                table: "Categories",
                type: "nvarchar(150)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CateID",
                table: "Products",
                column: "CateID",
                principalTable: "Categories",
                principalColumn: "CateID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CateID",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ReceiveCustomerMoney",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ReturnCustomerMoney",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "CateID",
                table: "Products",
                newName: "CategoryCateId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_CateID",
                table: "Products",
                newName: "IX_Products_CategoryCateId");

            migrationBuilder.RenameColumn(
                name: "CateID",
                table: "Categories",
                newName: "CateId");

            migrationBuilder.AddColumn<double>(
                name: "OriginalPrice",
                table: "SaleItems",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "SalePrice",
                table: "SaleItems",
                type: "float",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CateName",
                table: "Categories",
                type: "nvarchar(100)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Categories",
                type: "nvarchar(200)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSale",
                table: "Categories",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SaleItemCategories",
                columns: table => new
                {
                    SaleItemCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CateID = table.Column<int>(type: "int", nullable: true),
                    SaleID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleItemCategories", x => x.SaleItemCategoryID);
                    table.ForeignKey(
                        name: "FK_SaleItemCategories_Categories_CateID",
                        column: x => x.CateID,
                        principalTable: "Categories",
                        principalColumn: "CateId");
                    table.ForeignKey(
                        name: "FK_SaleItemCategories_Sale_SaleID",
                        column: x => x.SaleID,
                        principalTable: "Sale",
                        principalColumn: "SaleID");
                });

            migrationBuilder.CreateTable(
                name: "SaleItemProducts",
                columns: table => new
                {
                    SaleItemProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductID = table.Column<int>(type: "int", nullable: true),
                    SaleID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleItemProducts", x => x.SaleItemProductID);
                    table.ForeignKey(
                        name: "FK_SaleItemProducts_Products_ProductID",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                    table.ForeignKey(
                        name: "FK_SaleItemProducts_Sale_SaleID",
                        column: x => x.SaleID,
                        principalTable: "Sale",
                        principalColumn: "SaleID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentID",
                table: "Categories",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItemCategories_CateID",
                table: "SaleItemCategories",
                column: "CateID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItemCategories_SaleID",
                table: "SaleItemCategories",
                column: "SaleID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItemProducts_ProductID",
                table: "SaleItemProducts",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItemProducts_SaleID",
                table: "SaleItemProducts",
                column: "SaleID");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentID",
                table: "Categories",
                column: "ParentID",
                principalTable: "Categories",
                principalColumn: "CateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryCateId",
                table: "Products",
                column: "CategoryCateId",
                principalTable: "Categories",
                principalColumn: "CateId");
        }
    }
}
