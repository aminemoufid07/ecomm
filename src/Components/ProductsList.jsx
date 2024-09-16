import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../util/Firebase.jsx";
import { ref, getDownloadURL } from "firebase/storage";
import { Link, useLocation } from "react-router-dom";

const ListProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);

  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesList);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = [];
      let maxPriceValue = 0;

      for (let doc of productsSnapshot.docs) {
        const productData = doc.data();
        const productId = doc.id;

        const imageRef = ref(storage, `products/${productId}.jpg`);
        const imageUrl = await getDownloadURL(imageRef).catch((error) => {
          console.error("Error fetching product image:", error);
          return null;
        });

        productsList.push({ ...productData, id: productId, imageUrl });

        if (productData.price > maxPriceValue) {
          maxPriceValue = productData.price;
        }
      }

      setProducts(productsList);
      setFilteredProducts(productsList);
      setMaxPrice(maxPriceValue);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (priceFrom !== "" || priceTo !== "") {
      updatedProducts = updatedProducts.filter((product) => {
        const price = parseFloat(product.price);
        const from = parseFloat(priceFrom) || 0;
        const to = parseFloat(priceTo) || Infinity;
        return price >= from && price <= to;
      });
    }

    if (sortOption !== "default") {
      updatedProducts.sort((a, b) => {
        const [key, order] = sortOption.split(", ");
        if (key === "price") {
          return order === "ASC" ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
    }

    setFilteredProducts(updatedProducts);
  }, [products, selectedCategory, priceFrom, priceTo, sortOption]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setIsPriceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
            Catalogue des produits
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Explorez notre collection de produits avec des options variées et
            des prix compétitifs.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
            >
              <span className="text-sm font-medium">Catégorie</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`size-4 transition ${
                  isCategoryOpen ? "-rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {isCategoryOpen && (
              <div className="absolute mt-2 w-60 z-50 rounded border border-gray-200 bg-white">
                <div className="p-4">
                  <select
                    id="Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={priceRef}>
            <button
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
            >
              <span className="text-sm font-medium">Prix</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`size-4 transition ${
                  isPriceOpen ? "-rotate-180" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {isPriceOpen && (
              <div className="absolute mt-2 w-96 z-50 rounded border border-gray-200 bg-white">
                <div className="border-t border-gray-200 p-4">
                  <div className="flex justify-between gap-4">
                    <label className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">$</span>
                      <input
                        type="number"
                        value={priceFrom}
                        onChange={(e) => setPriceFrom(e.target.value)}
                        placeholder="À partir de"
                        className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">$</span>
                      <input
                        type="number"
                        value={priceTo}
                        onChange={(e) => setPriceTo(e.target.value)}
                        placeholder="Jusqu'à"
                        className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ml-auto">
            <select
              id="SortBy"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-10 rounded border-gray-300 text-sm"
            >
              <option value="default">Recommandé</option>
              <option value="price, ASC">Prix, ASC</option>
              <option value="price, DESC">Prix, DESC</option>
            </select>
          </div>
        </div>

        <ul className="mt-4 grid gap-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.imageUrl || "placeholder.jpg"}
                  alt={product.name}
                  className="h-[100px] w-[100px] object-cover transition duration-500 hover:scale-105 sm:h-[150px]"
                />
              </Link>
              <div className="relative bg-white pt-3">
                <h3 className="text-xs text-gray-700 hover:underline">
                  {product.name}
                </h3>
                <p className="mt-2">
                  <span className="tracking-wider text-gray-900">
                    {product.price} DH
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ListProducts;
