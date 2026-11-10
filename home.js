/* =====================================================
   GPTea · Trang chủ
   Phụ trách: <tên bạn>
   Phụ thuộc (có sẵn trong script.js): products, reviews, COUPONS,
   pcard(), esc(), money(), stars(), go()
   ===================================================== */

V.home = function () {
  const featured = products.slice(0, 4);

  // Lấy tối đa 3 đánh giá từ 4 sao trở lên để hiển thị
  const goodReviews = Object.values(reviews)
    .flat()
    .filter((r) => r.s >= 4)
    .slice(0, 3);

  const promos = Object.entries(COUPONS)
    .map(([code, c]) => `<b>${esc(code)}</b>: ${esc(c.txt)}`)
    .join(' · ');

  return `
    <div class="hero">
      <h1>Cà phê rang mới, snack giòn ngon cho mỗi ngày</h1>
      <p>GPTea chọn hạt cà phê sạch và snack tuyển chọn, đóng gói cẩn thận và giao tận nơi.</p>
      <button class="btn" onclick="go('catalog')">Xem sản phẩm</button>
    </div>

    <div class="note">
      <b>Ưu đãi hiện có:</b> ${promos}. Đơn từ 500.000₫ được miễn phí vận chuyển.
    </div>

    <div class="grid" style="margin-bottom:32px">
      <div class="card">
        <h3>Hạt rang mỗi tuần</h3>
        <p class="mute">Mẻ rang nhỏ, giao trong vài ngày để hương vị còn trọn vẹn.</p>
      </div>
      <div class="card">
        <h3>Snack tuyển chọn</h3>
        <p class="mute">Chọn theo vị, dễ nhâm nhi bên ly cà phê.</p>
      </div>
      <div class="card">
        <h3>Giao hàng tận nơi</h3>
        <p class="mute">Thanh toán khi nhận hàng, chuyển khoản hoặc ví điện tử.</p>
      </div>
    </div>

    <div class="row sp" style="margin-bottom:12px">
      <h2 style="margin:0">Bán chạy</h2>
      <button class="btn alt sm" onclick="go('catalog')">Xem tất cả</button>
    </div>
    ${
      featured.length
        ? `<div class="grid">${featured.map(pcard).join('')}</div>`
        : '<p class="mute">Cửa hàng chưa có sản phẩm. Quay lại sau nhé.</p>'
    }

    ${
      goodReviews.length
        ? `
      <h2 style="margin-top:36px">Khách hàng nói gì</h2>
      <div class="grid">
        ${goodReviews
          .map(
            (r) => `
          <div class="card">
            ${stars(r.s)}
            <p>${esc(r.t)}</p>
            <div class="mute">${esc(r.u)}</div>
          </div>`
          )
          .join('')}
      </div>`
        : ''
    }

    <div class="card row sp" style="margin-top:36px">
      <div>
        <h3 style="margin:0 0 4px">Cần tư vấn chọn sản phẩm?</h3>
        <span class="mute">Gửi câu hỏi, chúng tôi phản hồi trong ngày làm việc.</span>
      </div>
      <button class="btn" onclick="go('contact')">Liên hệ</button>
    </div>
  `;
};
