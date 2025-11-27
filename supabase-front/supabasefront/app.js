// app.js (frontend)

const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');

const updateSection = document.querySelector('#update-section');
const updateIdInput = document.querySelector('#update-id');
const updateName = document.querySelector('#update-name');
const updateDescription = document.querySelector('#update-description');
const updatePrice = document.querySelector('#update-price');
const updateSave = document.querySelector('#update-save');
const updateCancel = document.querySelector('#update-cancel');

const searchIdInput = document.querySelector('#search-id');
const searchBtn = document.querySelector('#search-btn');
const clearSearchBtn = document.querySelector('#clear-search');

const API_BASE = 'http://localhost:3000/products';

// fetch all or single
async function fetchProducts() {
  const response = await fetch(API_BASE);
  const products = await response.json();

  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.style.display = 'inline-block';
    li.style.margin = '8px';
    li.style.padding = '6px';
    li.style.background = '#f2f2f2';
    li.style.borderRadius = '6px';
    li.innerHTML = `<strong>${product.name}</strong> - ${product.description} - $${product.price}`;

    // delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '8px';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // update button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.style.marginLeft = '6px';
    updateButton.addEventListener('click', () => {
      // open update section with product data
      updateSection.style.display = 'block';
      updateIdInput.value = product.id;
      updateName.value = product.name || '';
      updateDescription.value = product.description || '';
      updatePrice.value = product.price || '';
      window.scrollTo(0,0);
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// add product
addProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const description = addProductForm.elements['description'].value;
  const price = addProductForm.elements['price'].value;

  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

// addProduct function (POST)
async function addProduct(name, description, price) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
  return response.json();
}

// deleteProduct (DELETE)
async function deleteProduct(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

// save update (PUT)
updateSave.addEventListener('click', async (ev) => {
  ev.preventDefault();
  const id = updateIdInput.value;
  const name = updateName.value;
  const description = updateDescription.value;
  const price = updatePrice.value;

  await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });

  updateSection.style.display = 'none';
  await fetchProducts();
});

// cancel update
updateCancel.addEventListener('click', () => {
  updateSection.style.display = 'none';
});

// search by id
searchBtn.addEventListener('click', async () => {
  const id = searchIdInput.value;
  if (!id) return alert('Digite um ID para buscar');
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    alert('Produto não encontrado');
    return;
  }
  const products = await res.json();
  // res.json() from API might return array or single object; handle both
  productList.innerHTML = '';
  const arr = Array.isArray(products) ? products : [products];
  arr.forEach(product => {
    const li = document.createElement('li');
    li.style.display = 'inline-block';
    li.style.margin = '8px';
    li.style.padding = '6px';
    li.style.background = '#f2f2f2';
    li.style.borderRadius = '6px';
    li.innerHTML = `<strong>${product.name}</strong> - ${product.description} - $${product.price}`;
    productList.appendChild(li);
  });
});

// clear search -> show all
clearSearchBtn.addEventListener('click', fetchProducts);

// initial load
fetchProducts();
