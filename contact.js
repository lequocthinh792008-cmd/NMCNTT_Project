/* =====================================================
   GPTea · Liên hệ
   Phụ trách: <tên bạn>
   Phụ thuộc (có sẵn trong script.js): me, load/save, $, esc, toast, go
   Dữ liệu: localStorage key "ts_contacts"
   { id, name, email, subject, msg, date }
   ===================================================== */

let contacts = load('contacts', []);

// Thông tin cửa hàng — thay bằng thông tin thật của nhóm
const SHOP = {
  name: 'GPTea Coffee Shop',
  addr: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  phone: '0900 000 000',
  email: 'xinchao@gptea.example',
  hours: '8:00 – 21:00 mỗi ngày'
};

const CONTACT_SUBJECTS = ['Hỏi về sản phẩm', 'Đơn hàng của tôi', 'Góp ý', 'Khác'];

V.contact = function () {
  const name = me?.name || '';
  const mail = me?.email && me.email.includes('@') ? me.email : '';

  return `
    <h2>Liên hệ</h2>
    <div class="two">
      <div class="card">
        <label for="kn">Họ tên</label>
        <input id="kn" value="${esc(name)}">
        <label for="ke">Email</label>
        <input id="ke" type="email" value="${esc(mail)}">
        <label for="ks">Chủ đề</label>
        <select id="ks">
          ${CONTACT_SUBJECTS.map((s) => `<option>${s}</option>`).join('')}
        </select>
        <label for="km">Nội dung</label>
        <textarea id="km" rows="5"></textarea>
        <p id="kerr" style="color:var(--err)"></p>
        <button class="btn" onclick="sendContact()">Gửi liên hệ</button>
      </div>

      <div class="card">
        <b>${esc(SHOP.name)}</b>
        <p>
          ${esc(SHOP.addr)}<br>
          Hotline: ${esc(SHOP.phone)}<br>
          Email: ${esc(SHOP.email)}<br>
          Giờ mở cửa: ${esc(SHOP.hours)}
        </p>
        <iframe
          title="Bản đồ cửa hàng"
          loading="lazy"
          style="width:100%;height:220px;border:0;border-radius:8px"
          src="https://www.google.com/maps?q=${encodeURIComponent(SHOP.addr)}&output=embed"></iframe>
      </div>
    </div>
  `;
};

function sendContact() {
  const name = $('#kn').value.trim(),
        email = $('#ke').value.trim(),
        subject = $('#ks').value,
        msg = $('#km').value.trim();

  if (!name) return ($('#kerr').textContent = 'Nhập họ tên.');
  if (!/^\S+@\S+\.\S+$/.test(email)) return ($('#kerr').textContent = 'Email chưa hợp lệ. Ví dụ: ten@gmail.com');
  if (!msg) return ($('#kerr').textContent = 'Nhập nội dung bạn muốn gửi.');

  contacts.push({ id: Date.now(), name, email, subject, msg, date: new Date().toLocaleString('vi-VN') });
  save('contacts', contacts);
  toast('Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm');
  go('home');
}

/* ---------- Dùng cho trang Quản trị (V.admin) ----------
   Người phụ trách admin chèn ${contactListHtml()} vào nơi muốn hiển thị. */
function contactListHtml() {
  if (!contacts.length) return '<p class="mute">Chưa có liên hệ nào.</p>';
  return `
    <div class="wrap">
      <table>
        <tr><th>Ngày</th><th>Khách</th><th>Chủ đề</th><th>Nội dung</th></tr>
        ${contacts
          .slice()
          .reverse()
          .map(
            (c) => `
          <tr>
            <td>${esc(c.date)}</td>
            <td>${esc(c.name)}<br><span class="mute">${esc(c.email)}</span></td>
            <td>${esc(c.subject)}</td>
            <td>${esc(c.msg)}</td>
          </tr>`
          )
          .join('')}
      </table>
    </div>
  `;
}
