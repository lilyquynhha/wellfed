-- CreateTable
CREATE TABLE "serving_cost_overrides" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "serving_id" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "serving_cost_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "serving_cost_overrides_user_id_serving_id_key" ON "serving_cost_overrides"("user_id", "serving_id");

-- AddForeignKey
ALTER TABLE "serving_cost_overrides" ADD CONSTRAINT "serving_cost_overrides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serving_cost_overrides" ADD CONSTRAINT "serving_cost_overrides_serving_id_fkey" FOREIGN KEY ("serving_id") REFERENCES "servings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
