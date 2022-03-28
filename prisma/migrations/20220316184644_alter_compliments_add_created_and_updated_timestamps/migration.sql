/*
  Warnings:

  - Added the required column `updatedAt` to the `compliments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_compliments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "userSenderId" TEXT NOT NULL,
    "userReceiverId" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "compliments_userSenderId_fkey" FOREIGN KEY ("userSenderId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compliments_userReceiverId_fkey" FOREIGN KEY ("userReceiverId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compliments_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_compliments" ("id", "message", "tag_id", "userReceiverId", "userSenderId") SELECT "id", "message", "tag_id", "userReceiverId", "userSenderId" FROM "compliments";
DROP TABLE "compliments";
ALTER TABLE "new_compliments" RENAME TO "compliments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
