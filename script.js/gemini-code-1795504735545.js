const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";

function calculateTotal() {
  const qty1 = parseInt(document.getElementById("qty-sku01").value) || 0;
  const qty2 = parseInt(document.getElementById("qty-sku02").value) || 0;

  const total = (qty1 * 120) + (qty2 * 150);
  document.getElementById("total-price").innerText = total;

  let summary = [];
  if (qty1 > 0) summary.push(`[SKU-01 สบู่ขมิ้นชัน x ${qty1}]`);
  if (qty2 > 0) summary.push(`[SKU-02 สบู่ข้าวโอ๊ต x ${qty2}]`);

  document.getElementById("order-summary").innerText = summary.length > 0 ? summary.join(", ") : "ยังไม่ได้เลือกสินค้า";
  return { total, itemsText: summary.join(", ") };
}

document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const orderData = calculateTotal();

  if (orderData.total === 0) {
    alert("กรุณาเลือกจำนวนสบู่อย่างน้อย 1 ก้อนครับ");
    return;
  }

  const btn = document.getElementById("submitBtn");
  const statusMsg = document.getElementById("statusMessage");
  btn.disabled = true;
  btn.innerText = "กำลังบันทึกข้อมูลสั่งซื้อ...";

  const payload = {
    name: document.getElementById("custName").value,
    phone: document.getElementById("custPhone").value,
    address: document.getElementById("custAddress").value,
    items: orderData.itemsText,
    total: orderData.total
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.result === "success") {
      statusMsg.style.color = "green";
      statusMsg.innerText = `✅ สั่งซื้อสำเร็จ! รหัสออเดอร์ของคุณคือ: ${data.orderId}`;
      document.getElementById("orderForm").reset();
      document.getElementById("qty-sku01").value = 0;
      document.getElementById("qty-sku02").value = 0;
      calculateTotal();
    }
  })
  .catch(err => {
    statusMsg.style.color = "red";
    statusMsg.innerText = "❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    console.error(err);
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerText = "ยืนยันการสั่งซื้อ";
  });
});