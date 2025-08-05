const cron = require("node-cron");
const Borrow = require("../models/borrow.model");
const borrowStatusEnum = require("../enums/borrowStatus.enum");

// Cron job chạy mỗi 1h
cron.schedule("0 * * * *", async () => {
  console.log("🔍 Checking pending borrows older than 48h...");

  const now = new Date();
  const expiredTime = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 giờ trước

  const result = await Borrow.updateMany(
    {
      status: borrowStatusEnum.PENDING,
      createdAt: { $lte: expiredTime },
    },
    {
      $set: {
        status: borrowStatusEnum.REJECTED,
        note: "Yêu cầu mượn sách đã tự động từ chối do quá thời gian chờ (48 giờ).",
      },
    }
  );

  if (result.modifiedCount > 0) {
    console.log(`Auto-rejected ${result.modifiedCount} pending borrows.`);
  }
});
