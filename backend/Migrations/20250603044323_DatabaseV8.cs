using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseV8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalEventSupplys_MedicalEvents_MedicalEventId",
                table: "MedicalEventSupplys");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalEventSupplys_MedicalSupplys_MedicalSupplyId",
                table: "MedicalEventSupplys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalSupplys",
                table: "MedicalSupplys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalEventSupplys",
                table: "MedicalEventSupplys");

            migrationBuilder.RenameTable(
                name: "MedicalSupplys",
                newName: "MedicalSupplies");

            migrationBuilder.RenameTable(
                name: "MedicalEventSupplys",
                newName: "MedicalEventSupplies");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalEventSupplys_MedicalSupplyId",
                table: "MedicalEventSupplies",
                newName: "IX_MedicalEventSupplies_MedicalSupplyId");

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "Students",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "MedicalEvents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalSupplies",
                table: "MedicalSupplies",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalEventSupplies",
                table: "MedicalEventSupplies",
                columns: new[] { "MedicalEventId", "MedicalSupplyId" });

            migrationBuilder.CreateIndex(
                name: "IX_Students_StudentId",
                table: "Students",
                column: "StudentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalEventSupplies_MedicalEvents_MedicalEventId",
                table: "MedicalEventSupplies",
                column: "MedicalEventId",
                principalTable: "MedicalEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalEventSupplies_MedicalSupplies_MedicalSupplyId",
                table: "MedicalEventSupplies",
                column: "MedicalSupplyId",
                principalTable: "MedicalSupplies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalEventSupplies_MedicalEvents_MedicalEventId",
                table: "MedicalEventSupplies");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalEventSupplies_MedicalSupplies_MedicalSupplyId",
                table: "MedicalEventSupplies");

            migrationBuilder.DropIndex(
                name: "IX_Students_StudentId",
                table: "Students");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalSupplies",
                table: "MedicalSupplies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicalEventSupplies",
                table: "MedicalEventSupplies");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "MedicalEvents");

            migrationBuilder.RenameTable(
                name: "MedicalSupplies",
                newName: "MedicalSupplys");

            migrationBuilder.RenameTable(
                name: "MedicalEventSupplies",
                newName: "MedicalEventSupplys");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalEventSupplies_MedicalSupplyId",
                table: "MedicalEventSupplys",
                newName: "IX_MedicalEventSupplys_MedicalSupplyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalSupplys",
                table: "MedicalSupplys",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicalEventSupplys",
                table: "MedicalEventSupplys",
                columns: new[] { "MedicalEventId", "MedicalSupplyId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalEventSupplys_MedicalEvents_MedicalEventId",
                table: "MedicalEventSupplys",
                column: "MedicalEventId",
                principalTable: "MedicalEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalEventSupplys_MedicalSupplys_MedicalSupplyId",
                table: "MedicalEventSupplys",
                column: "MedicalSupplyId",
                principalTable: "MedicalSupplys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
