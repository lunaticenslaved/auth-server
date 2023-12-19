-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);


-- CreateTable
CREATE TABLE "_ServiceToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToUser_AB_unique" ON "_ServiceToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToUser_B_index" ON "_ServiceToUser"("B");

-- AddForeignKey
ALTER TABLE "_ServiceToUser" ADD CONSTRAINT "_ServiceToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToUser" ADD CONSTRAINT "_ServiceToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

