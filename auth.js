/* =====================================================
   GPTea · Đăng ký / Đăng nhập / Tài khoản
   Phụ trách: <tên bạn>
   Phụ thuộc (có sẵn trong script.js): users, me, orders, load/save,
   $, esc, toast, go, upd, orderTable
   Lưu ý: mật khẩu lưu dạng chữ thường trong localStorage và tài khoản
   admin/admin viết cứng — chỉ phù hợp bài tập mô phỏng.
   ===================================================== */

let nextView = null; // trang cần quay lại sau khi đăng nhập

/**
 * Dùng thay cho go() khi trang yêu cầu đăng nhập.
 * Ví dụ: <button onclick="requireLogin('checkout')">Thanh toán</button>
 */
function requireLogin(v, a) {
  if (!me) {
    nextView = [v, a ?? null];
    toast('Vui lòng đăng nhập để tiếp tục');
    return go('auth');
  }
  go(v, a);
}

function authFail(id, msg) {
  $(id).textContent = msg;
}

function togglePw(id) {
  const el = $(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

V.auth = function () {
  if (me) {
    const isAdmin = me.role === 'admin';
    return `
      <h2>Tài khoản</h2>
      <div class="card">
        <p>Xin chào, <b>${esc(me.name)}</b> (${isAdmin ? 'Quản trị viên' : 'Khách hàng'}).</p>
        <div class="row" style="margin-bottom:18px">
          <button class="btn alt sm" onclick="go('address')">Sổ địa chỉ</button>
          <button class="btn alt sm" onclick="logout()">Đăng xuất</button>
        </div>
        <h3>Đơn hàng của bạn</h3>
        ${orderTable(orders.filter((o) => o.user === me.email))}
      </div>
    `;
  }

  return `
    <div class="two">
      <div class="card">
        <h2>Đăng nhập</h2>
        <label for="le">Email / tên đăng nhập</label>
        <input id="le" autocomplete="username" onkeydown="if(event.key==='Enter')login()">
        <label for="lp">Mật khẩu</label>
        <input id="lp" type="password" autocomplete="current-password" onkeydown="if(event.key==='Enter')login()">
        <p class="mute"><a href="#" onclick="togglePw('#lp');return false">Hiện / ẩn mật khẩu</a></p>
        <p id="lerr" style="color:var(--err)"></p>
        <button class="btn" onclick="login()">Đăng nhập</button>
      </div>

      <div class="card">
        <h2>Đăng ký</h2>
        <label for="rn">Họ tên</label>
        <input id="rn" autocomplete="name">
        <label for="re">Email</label>
        <input id="re" type="email" autocomplete="email">
        <label for="rp">Mật khẩu (từ 6 ký tự)</label>
        <input id="rp" type="password" autocomplete="new-password">
        <label for="rp2">Nhập lại mật khẩu</label>
        <input id="rp2" type="password" autocomplete="new-password" onkeydown="if(event.key==='Enter')register()">
        <p id="rerr" style="color:var(--err)"></p>
        <button class="btn" onclick="register()">Tạo tài khoản</button>
      </div>
    </div>
  `;
};

function register() {
  const n = $('#rn').value.trim(),
        e = $('#re').value.trim().toLowerCase(),
        p = $('#rp').value,
        p2 = $('#rp2').value;

  if (!n) return authFail('#rerr', 'Nhập họ tên.');
  if (!/^\S+@\S+\.\S+$/.test(e)) return authFail('#rerr', 'Email chưa hợp lệ. Ví dụ: ten@gmail.com');
  if (p.length < 6) return authFail('#rerr', 'Mật khẩu cần từ 6 ký tự.');
  if (p !== p2) return authFail('#rerr', 'Mật khẩu nhập lại không khớp.');
  if (users.some((u) => u.email === e)) return authFail('#rerr', 'Email này đã được đăng ký. Hãy đăng nhập.');

  const u = { name: n, email: e, pw: p, role: 'user' };
  users.push(u);
  save('users', users);
  setMe(u);
}

function login() {
  const e = $('#le').value.trim().toLowerCase(),
        p = $('#lp').value;

  if (!e || !p) return authFail('#lerr', 'Nhập email và mật khẩu.');

  const u =
    e === 'admin' && p === 'admin'
      ? { name: 'Quản trị viên', email: 'admin', role: 'admin' }
      : users.find((x) => x.email === e && x.pw === p);

  if (!u) return authFail('#lerr', 'Sai thông tin đăng nhập. Kiểm tra lại email và mật khẩu.');
  setMe(u);
}

function setMe(u) {
  me = { name: u.name, email: u.email, role: u.role };
  save('me', me);
  upd();
  toast('Xin chào ' + me.name);

  if (nextView) {
    const [v, a] = nextView;
    nextView = null;
    return go(v, a);
  }
  go(me.role === 'admin' ? 'admin' : 'home');
}

function logout() {
  me = null;
  nextView = null;
  save('me', null);
  upd();
  toast('Đã đăng xuất');
  go('home');
}
