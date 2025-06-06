using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Users_AssignedToId",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Users_CreatedById",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_NotificationStudent_Notification_NotificationId",
                table: "NotificationStudent");

            migrationBuilder.DropForeignKey(
                name: "FK_NotificationStudent_Students_StudentId",
                table: "NotificationStudent");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NotificationStudent",
                table: "NotificationStudent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Notification",
                table: "Notification");

            migrationBuilder.RenameTable(
                name: "NotificationStudent",
                newName: "NotificationStudents");

            migrationBuilder.RenameTable(
                name: "Notification",
                newName: "Notifications");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Students",
                newName: "ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_Students_UserId",
                table: "Students",
                newName: "IX_Students_ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_NotificationStudent_StudentId",
                table: "NotificationStudents",
                newName: "IX_NotificationStudents_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Notification_CreatedById",
                table: "Notifications",
                newName: "IX_Notifications_CreatedById");

            migrationBuilder.RenameIndex(
                name: "IX_Notification_AssignedToId",
                table: "Notifications",
                newName: "IX_Notifications_AssignedToId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NotificationStudents",
                table: "NotificationStudents",
                columns: new[] { "NotificationId", "StudentId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notifications",
                table: "Notifications",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_AssignedToId",
                table: "Notifications",
                column: "AssignedToId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_CreatedById",
                table: "Notifications",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationStudents_Notifications_NotificationId",
                table: "NotificationStudents",
                column: "NotificationId",
                principalTable: "Notifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationStudents_Students_StudentId",
                table: "NotificationStudents",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_ParentId",
                table: "Students",
                column: "ParentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_AssignedToId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_CreatedById",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_NotificationStudents_Notifications_NotificationId",
                table: "NotificationStudents");

            migrationBuilder.DropForeignKey(
                name: "FK_NotificationStudents_Students_StudentId",
                table: "NotificationStudents");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Users_ParentId",
                table: "Students");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NotificationStudents",
                table: "NotificationStudents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Notifications",
                table: "Notifications");

            migrationBuilder.RenameTable(
                name: "NotificationStudents",
                newName: "NotificationStudent");

            migrationBuilder.RenameTable(
                name: "Notifications",
                newName: "Notification");

            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "Students",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Students_ParentId",
                table: "Students",
                newName: "IX_Students_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_NotificationStudents_StudentId",
                table: "NotificationStudent",
                newName: "IX_NotificationStudent_StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_CreatedById",
                table: "Notification",
                newName: "IX_Notification_CreatedById");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_AssignedToId",
                table: "Notification",
                newName: "IX_Notification_AssignedToId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NotificationStudent",
                table: "NotificationStudent",
                columns: new[] { "NotificationId", "StudentId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notification",
                table: "Notification",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Users_AssignedToId",
                table: "Notification",
                column: "AssignedToId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Users_CreatedById",
                table: "Notification",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationStudent_Notification_NotificationId",
                table: "NotificationStudent",
                column: "NotificationId",
                principalTable: "Notification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationStudent_Students_StudentId",
                table: "NotificationStudent",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
