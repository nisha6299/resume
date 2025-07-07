let productList = [];

async function fetchProducts() {
  const loading = document.getElementById('loadingMsg');
  const container = document.getElementById('product-container');
  const sortDropdown = document.getElementById('sortSelect');
  const cart = document.getElementById('cartMessage');
  const productCount = document.getElementById('productCount');

  if (loading) loading.style.display = 'block';
  container.innerHTML = '';
  productList = [];

  try {
    const response = await fetch('https://interveiw-mock-api.vercel.app/api/getProducts');
    const result = await response.json();
    const items = result?.data;
    const products = items.map(item => item.product);

    if (!products || products.length === 0) {
      loading.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" width="80"/>
        <p>No products found.</p>`;
      return;
    }

    productList = products;
    if (loading) loading.style.display = 'none';
    if (cart) cart.style.display = 'none';
    container.style.display = 'grid';

    renderProducts(products);
    productCount.innerText = `Total Products: ${products.length}`;

    if (!sortDropdown.dataset.listenerAdded) {
      sortDropdown.addEventListener('change', () => {
        sortProducts(sortDropdown.value);
      });
      sortDropdown.dataset.listenerAdded = true;
    }

  } catch (error) {
    console.error('Error:', error);
    if (loading) {
      loading.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" width="80"/>
        <p>Failed to load products.</p>`;
    }
  }
}

function renderProducts(products) {
  const container = document.getElementById('product-container');
  container.innerHTML = '';

  products.forEach((product, index) => {
    const name = product.title;
    const image = product.image?.src || 'https://via.placeholder.com/250x200?text=No+Image';
    const price = product.variants?.[0]?.price || 'N/A';
    const desc = product.product_type || 'No description';

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${image}" alt="${name}" />
      <h3 class="title">${name}</h3>
      <p class="price">$${price}</p>
      <p class="desc">${desc}</p>
    `;

    container.appendChild(card);
    setTimeout(() => card.classList.add('visible'), index * 100);
  });
}

function sortProducts(order) {
  if (!productList.length) return;

  let sorted = [...productList];

  if (order === 'lowToHigh') {
    sorted.sort((a, b) => parseFloat(a.variants?.[0]?.price) - parseFloat(b.variants?.[0]?.price));
  } else if (order === 'highToLow') {
    sorted.sort((a, b) => parseFloat(b.variants?.[0]?.price) - parseFloat(a.variants?.[0]?.price));
  }

  renderProducts(sorted);
  const productCount = document.getElementById('productCount');
  productCount.innerText = `Total Products: ${sorted.length}`;
}
