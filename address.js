/* =====================================================
   GPTea · Sổ địa chỉ giao hàng
   Phụ trách: <tên bạn>
   Phụ thuộc (có sẵn trong script.js): me, load/save, $, esc, toast, go, render
   Dữ liệu: localStorage key "ts_addresses"
   { id, user (email), label, name, phone, addr, def }
   ===================================================== */

let addresses = load('addresses', []);
let editAddrId = null; // id địa chỉ đang sửa (null = đang thêm mới)

const ADDR_LABELS = ['Nhà riêng', 'Văn phòng', 'Khác'];
const myAddrs = () => addresses.filter((a) => a.user === me?.email);
const defaultAddr = () => myAddrs().find((a) => a.def) || myAddrs()[0];

V.address = function () {
  if (!me) {
    return `
      <h2>Sổ địa chỉ</h2>
      <p class="mute">Đăng nhập để lưu và quản lý địa chỉ giao hàng.</p>
      <button class="btn" onclick="requireLogin('address')">Đăng nhập</button>
    `;
  }

  const list = myAddrs();
  const e = list.find((a) => a.id === editAddrId); // undefined nếu đang thêm mới

  return `
    <button class="btn alt sm" onclick="go('auth')">← Tài khoản</button>
    <h2 style="margin-top:14px">Sổ địa chỉ</h2>
    <div class="two">
      <div>
        ${
          list.length
            ? list
                .map(
                  (a) => `
          <div class="card" style="margin-bottom:10px">
            <div class="row sp">
              <b>${esc(a.label)}</b>
              ${a.def ? '<span class="badge">Mặc định</span>' : ''}
            </div>
            <p style="margin:6px 0 0">${esc(a.name)} · ${esc(a.phone)}</p>
            <p class="mute" style="margin:2px 0 10px">${esc(a.addr)}</p>
            <button class="btn alt sm" onclick="editAddr(${a.id})">Sửa</button>
            ${a.def ? '' : `<button class="btn alt sm" onclick="setDefaultAddr(${a.id})">Đặt mặc định</button>`}
            <button class="btn alt sm" onclick="delAddr(${a.id})">Xóa</button>
          </div>`
                )
                .join('')
            : '<p class="mute">Bạn chưa lưu địa chỉ nào. Thêm địa chỉ đầu tiên ở khung bên cạnh.</p>'
        }
      </div>

      <div class="card">
        <h3>${e ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h3>
        <label for="adl">Loại địa chỉ</label>
        <select id="adl">
          ${ADDR_LABELS.map((l) => `<option ${e?.label === l ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
        <label for="adn">Họ tên người nhận</label>
        <input id="adn" value="${esc(e?.name ?? me.name)}">
        <label for="adp">Số điện thoại</label>
        <input id="adp" inputmode="tel" value="${esc(e?.phone ?? '')}">
        <label for="ada">Địa chỉ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)</label>
        <textarea id="ada" rows="3">${esc(e?.addr ?? '')}</textarea>
        <p id="aderr" style="color:var(--err)"></p>
        <div class="row">
          <button class="btn" onclick="saveAddr()">${e ? 'Lưu thay đổi' : 'Thêm địa chỉ'}</button>
          ${e ? '<button class="btn alt" onclick="cancelEditAddr()">Hủy</button>' : ''}
        </div>
      </div>
    </div>
  `;
};

function saveAddr() {
  const label = $('#adl').value,
        name = $('#adn').value.trim(),
        phone = $('#adp').value.trim(),
        addr = $('#ada').value.trim();

  if (!name || !addr) {
    $('#aderr').textContent = 'Nhập họ tên người nhận và địa chỉ.';
    return;
  }
  if (!/^0\d{9}$/.test(phone)) {
    $('#aderr').textContent = 'Số điện thoại cần đủ 10 số và bắt đầu bằng 0.';
    return;
  }

  const cur = addresses.find((a) => a.id === editAddrId && a.user === me.email);
  if (cur) {
    Object.assign(cur, { label, name, phone, addr });
    toast('Đã cập nhật địa chỉ');
  } else {
    addresses.push({ id: Date.now(), user: me.email, label, name, phone, addr, def: myAddrs().length === 0 });
    toast('Đã lưu địa chỉ');
  }
  editAddrId = null;
  save('addresses', addresses);
  render();
}

function editAddr(id) {
  editAddrId = id;
  render();
  scrollTo(0, 0);
}

function cancelEditAddr() {
  editAddrId = null;
  render();
}

function setDefaultAddr(id) {
  myAddrs().forEach((a) => (a.def = a.id === id));
  save('addresses', addresses);
  render();
  toast('Đã đặt làm địa chỉ mặc định');
}

function delAddr(id) {
  if (!confirm('Xóa địa chỉ này?')) return;
  const was = addresses.find((a) => a.id === id);
  addresses = addresses.filter((a) => a.id !== id);
  const rest = myAddrs();
  if (was?.def && rest.length) rest[0].def = true;
  if (editAddrId === id) editAddrId = null;
  save('addresses', addresses);
  render();
}

/* ---------- Dùng ở trang thanh toán (V.checkout) ----------
   Người phụ trách checkout chỉ cần chèn ${savedAddrSelect()} phía trên
   ô "Họ tên". Nếu khách chưa đăng nhập hoặc chưa có địa chỉ, hàm trả về ''. */
function savedAddrSelect() {
  const list = myAddrs();
  if (!me || !list.length) return '';
  return `
    <label>Địa chỉ đã lưu</label>
    <select onchange="fillAddr(this.value)">
      <option value="">-- Chọn địa chỉ --</option>
      ${list
        .map((a) => `<option value="${a.id}">${esc(a.label)}${a.def ? ' (mặc định)' : ''}: ${esc(a.addr)}</option>`)
        .join('')}
    </select>
  `;
}

function fillAddr(id) {
  const a = addresses.find((x) => x.id == id);
  if (!a) return;
  $('#cn').value = a.name;
  $('#cph').value = a.phone;
  $('#ca').value = a.addr;
}
