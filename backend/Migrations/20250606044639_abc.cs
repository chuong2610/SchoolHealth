using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class abc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicationDeclares_Medications_MedicationId",
                table: "MedicationDeclares");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Roles",
                table: "Roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicationDeclares",
                table: "MedicationDeclares");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "Role");

            migrationBuilder.RenameTable(
                name: "MedicationDeclares",
                newName: "MedicationDeclare");

            migrationBuilder.RenameIndex(
                name: "IX_MedicationDeclares_MedicationId",
                table: "MedicationDeclare",
                newName: "IX_MedicationDeclare_MedicationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Role",
                table: "Role",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicationDeclare",
                table: "MedicationDeclare",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationDeclare_Medications_MedicationId",
                table: "MedicationDeclare",
                column: "MedicationId",
                principalTable: "Medications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Role_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicationDeclare_Medications_MedicationId",
                table: "MedicationDeclare");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Role_RoleId",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Role",
                table: "Role");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MedicationDeclare",
                table: "MedicationDeclare");

            migrationBuilder.RenameTable(
                name: "Role",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "MedicationDeclare",
                newName: "MedicationDeclares");

            migrationBuilder.RenameIndex(
                name: "IX_MedicationDeclare_MedicationId",
                table: "MedicationDeclares",
                newName: "IX_MedicationDeclares_MedicationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Roles",
                table: "Roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MedicationDeclares",
                table: "MedicationDeclares",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationDeclares_Medications_MedicationId",
                table: "MedicationDeclares",
                column: "MedicationId",
                principalTable: "Medications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
