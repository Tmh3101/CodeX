/**
 * Enum for borrow status types.
 * @enum {string}
 */

module.exports = {
  PENDING: "pending", // Borrow request is pending
  APPROVED: "approved", // Borrow request is approved
  REJECTED: "rejected", // Borrow request is rejected by staff
  RETURNED: "returned", // Book has been returned
  CANCELLED: "cancelled", // Borrow request has been cancelled by reader
};
