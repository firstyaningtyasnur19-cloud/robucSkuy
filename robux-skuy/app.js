// Robux skuy — App JS
const state = {
  products: [
    {id:'rbx-080', name:'Robux 80', price:15000, cut:20000, badge:'Hemat', img:'./assets/p1.svg'},
    {id:'rbx-400', name:'Robux 400', price:68000, cut:80000, badge:'Favorit', img:'./assets/p2.svg'},
    {id:'rbx-800', name:'Robux 800', price:129000, cut:150000, badge:'Best Deal', img:'./assets/p3.svg'},
    {id:'rbx-1700', name:'Robux 1.700', price:269000, cut:300000, badge:'Premium', img:'./assets/p4.svg'},
    {id:'rbx-4500', name:'Robux 4.500', price:699000, cut:770000, badge:'Sultan', img:'./assets/p5.svg'},
    {id:'rbx-10000', name:'Robux 10.000', price:1499000, cut:1700000, badge:'Sultan+', img:'./assets/p6.svg'},
    {id:'prem-1', name:'Premium 1 Bulan', price:85000, cut:95000, badge:'Premium', img:'./assets/p7.svg'},
    {id:'prem-12', name:'Premium 12 Bulan', price:829000, cut:900000, badge:'Premium+', img:'./assets/p8.svg'},
  ],
  cart: JSON.parse(localStorage.getItem('cart-rbx')||'[]')
};

const fmt = new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'});
const $ = (s, ctx=document)=>ctx.querySelector(s);
const $$ = (s, ctx=document)=>[...ctx.querySelectorAll(s)];

function renderProducts(list=state.products){
  const grid = $('#productGrid');
  grid.innerHTML = list.map(p=>`
    <div class="card" data-id="${p.id}">
      <div class="thumb">
        <img src="${p.img}" alt="${p.name}">
        <span class="badge-pill">${p.badge}</span>
      </div>
      <div class="body">
        <h3>${p.name}</h3>
        <div class="price"><span class="now">${fmt.format(p.price)}</span> <span class="cut">${fmt.format(p.cut)}</span></div>
        <p class="small">Proses instan • Aman • Bukti transaksi</p>
        <div class="actions">
          <button class="btn add">Tambah</button>
          <button class="btn ghost buy">Beli Sekarang</button>
        </div>
      </div>
    </div>
  `).join('');

  $$('.add', grid).forEach((btn,i)=>btn.addEventListener('click',()=>addToCart(list[i].id)));
  $$('.buy', grid).forEach((btn,i)=>btn.addEventListener('click',()=>{ addToCart(list[i].id); openCart(); }));
}

function addToCart(id){
  const item = state.cart.find(i=>i.id===id);
  if(item){ item.qty++; }
  else{
    const p = state.products.find(x=>x.id===id);
    state.cart.push({id:p.id, name:p.name, price:p.price, img:p.img, qty:1});
  }
  persistCart();
  renderCart();
  toast('Ditambahkan ke keranjang');
}

function persistCart(){
  localStorage.setItem('cart-rbx', JSON.stringify(state.cart));
  $('#cartCount').textContent = state.cart.reduce((a,b)=>a+b.qty,0);
}

function renderCart(){
  const box = $('#cartItems');
  if(!state.cart.length){
    box.innerHTML = '<p class="small">Keranjang kosong. Yuk belanja dulu ✨</p>';
    $('#cartTotal').textContent = fmt.format(0);
    return;
  }
  box.innerHTML = state.cart.map((i, idx)=>`
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div class="meta">
        <strong>${i.name}</strong>
        <div class="small">${fmt.format(i.price)} / paket</div>
        <div class="qty">
          <button data-act="dec" data-idx="${idx}">-</button>
          <span>${i.qty}</span>
          <button data-act="inc" data-idx="${idx}">+</button>
          <button data-act="rm" data-idx="${idx}" style="margin-left:auto">Hapus</button>
        </div>
      </div>
    </div>
  `).join('');

  let total = state.cart.reduce((a,b)=>a + b.price*b.qty, 0);
  $('#cartTotal').textContent = fmt.format(total);

  $$('#cartItems [data-act]').forEach(btn=>btn.addEventListener('click', e=>{
    const act = e.currentTarget.dataset.act;
    const idx = +e.currentTarget.dataset.idx;
    const it = state.cart[idx];
    if(act==='inc') it.qty++;
    if(act==='dec') it.qty = Math.max(1, it.qty-1);
    if(act==='rm') state.cart.splice(idx,1);
    persistCart();
    renderCart();
  }));
}

function openCart(){ $('#cartDrawer').setAttribute('aria-hidden','false'); }
function closeCart(){ $('#cartDrawer').setAttribute('aria-hidden','true'); }
function openSearch(){ $('#searchDrawer').setAttribute('aria-hidden','false'); $('#searchInput').focus(); }
function closeSearch(){ $('#searchDrawer').setAttribute('aria-hidden','true'); }
function openCheckoutModal(){ $('#checkoutModal').setAttribute('aria-hidden','false'); }
function closeCheckoutModal(){ $('#checkoutModal').setAttribute('aria-hidden','true'); }

// Slider
let currentSlide = 0;
function showSlide(n){
  const slides = $$('.slide');
  const dots = $$('.dot');
  slides.forEach(s=>s.classList.remove('current'));
  dots.forEach(d=>d.classList.remove('current'));
  slides[n].classList.add('current');
  dots[n].classList.add('current');
  currentSlide = n;
}
setInterval(()=>showSlide((currentSlide+1)%3), 4000);
$$('.dot').forEach(d=>d.addEventListener('click', e=>showSlide(+e.currentTarget.dataset.slide)));

// Search filter
$('#searchBtn').addEventListener('click', openSearch);
$$('[data-close-drawer]').forEach(b=>b.addEventListener('click', e=>{
  e.target.closest('.drawer').setAttribute('aria-hidden','true');
}));
$('#searchInput').addEventListener('input', e=>{
  const q = e.target.value.toLowerCase();
  const filtered = state.products.filter(p=> p.name.toLowerCase().includes(q) || p.id.includes(q));
  renderProducts(filtered);
});

// Cart + checkout
$('#cartBtn').addEventListener('click', openCart);
$$('#cartDrawer [data-close-drawer]').forEach(b=>b.addEventListener('click', closeCart));
$('#checkoutBtn').addEventListener('click', ()=>{ closeCart(); openCheckoutModal(); });
$('#openCheckout').addEventListener('click', openCheckoutModal);
$$('[data-close-modal]').forEach(b=>b.addEventListener('click', closeCheckoutModal));

$('#checkoutForm').addEventListener('submit', e=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  if(!state.cart.length){ toast('Keranjang kosong'); return; }
  // Fake order id
  const orderId = 'RBX-' + Math.random().toString(36).slice(2,8).toUpperCase();
  const order = { orderId, items: state.cart, total: state.cart.reduce((a,b)=>a+b.price*b.qty,0), ...data, createdAt: new Date().toISOString() };
  localStorage.setItem('last-order', JSON.stringify(order));
  state.cart = []; persistCart(); renderCart();
  closeCheckoutModal();
  toast('Pesanan dibuat #' + orderId + ' (demo)');
});

// Reveal-on-scroll animation
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('reveal'); io.unobserve(entry.target); }
  });
},{threshold:.12});
$$('[data-animate]').forEach(el=>io.observe(el));

// Background particles
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W=0,H=0, parts=[];
function resize(){
  W = canvas.width = innerWidth; H = canvas.height = Math.max(innerHeight, document.body.scrollHeight);
  parts = Array.from({length: Math.min(120, Math.floor(W*H/18000))},()=>({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*1.8 + .4,
    vx: (Math.random()-.5)*.2,
    vy: (Math.random()-.5)*.2,
    a: Math.random()*.6+.15
  }));
}
window.addEventListener('resize', resize); resize();
function loop(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#d1d5db';
  parts.forEach(p=>{
    p.x += p.vx; p.y += p.vy;
    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;
    ctx.globalAlpha = p.a;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(loop);
}
loop();

// Utils
function toast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 2000);
}

// Boot
renderProducts();
persistCart();
renderCart();
$('#year').textContent = new Date().getFullYear();
