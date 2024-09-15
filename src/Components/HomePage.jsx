import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db, storage } from "../util/Firebase"; // Ensure the path is correct
import { ref, getDownloadURL } from "firebase/storage";
import "./HomePage.css"; // Add necessary custom styles if any

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "categories"); // Fetch categories collection
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = [];

        for (let doc of categoriesSnapshot.docs) {
          const categoryData = doc.data();
          const categoryName = categoryData.name;

          const possibleExtensions = ["jpg", "png", "jpeg", "webp"];
          let imageUrl = null;

          for (let ext of possibleExtensions) {
            const imageRef = ref(storage, `categories/${categoryName}.${ext}`);
            imageUrl = await getDownloadURL(imageRef).catch(() => null);
            if (imageUrl) break;
          }

          if (imageUrl) {
            categoriesList.push({ ...categoryData, imageUrl });
          }
        }

        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsQuery = query(
          productsCollection,
          orderBy("date", "desc"),
          limit(4)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const productsList = [];

        for (let doc of productsSnapshot.docs) {
          const productData = doc.data();
          const productId = doc.id;

          const imageRef = ref(storage, `products/${productId}.jpg`);
          const imageUrl = await getDownloadURL(imageRef).catch((error) => {
            console.error("Error fetching product image:", error);
            return null;
          });

          productsList.push({ ...productData, id: productId, imageUrl });
        }

        setFeaturedProducts(productsList);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-5">
      {/* Existing Carousel Section */}
      <div
        id="carouselExampleDark"
        className="carousel carousel-dark slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {categories.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {categories.length === 0 ? (
            <div className="carousel-item active">
              <p>No Categories Available</p>
            </div>
          ) : (
            categories.map((category, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                data-bs-interval={10000}
              >
                <Link to={`/products?category=${category.name}`}>
                  <img
                    src={category.imageUrl}
                    className="d-block w-100"
                    alt={category.name}
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                  <div
                    className="carousel-caption d-none d-md-block"
                    style={{
                      bottom: "-20%",
                      marginLeft: "500px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <h1
                      style={{
                        fontFamily:
                          '"Cervo-Medium", Arial, "Helvetica Neue", Helvetica, sans-serif',
                        fontSize: "52px",
                        lineHeight: "1.2",
                        letterSpacing: "-3px",
                        fontWeight: 500,
                        color: "white",
                        margin: "1rem auto",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          right: "0",
                          bottom: "0",
                          fontSize: "52px",
                          lineHeight: "1.2",
                          fontWeight: 500,
                          color: "transparent",
                          textShadow: "0 0 4px #ffffff",
                          zIndex: "-1",
                        }}
                      >
                        {category.name}
                      </span>
                      {category.name}
                    </h1>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Featured Products Section */}

      <section className="mt-8">
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-4xl text-center mb-6">
          Featured Products
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <li key={product.id} className="bg-white rounded shadow-sm p-4">
              <Link to={`/product/${product.id}`}>
                <div className="flex justify-center items-center h-[200px]">
                  {" "}
                  {/* New div to center the image */}
                  <img
                    src={product.imageUrl || "placeholder.jpg"}
                    alt={product.name}
                    className="h-[150px] w-[150px] object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              </Link>
              <div className="mt-2 text-center">
                {" "}
                {/* Centering text as well */}
                <h3 className="text-sm font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-lg text-gray-600">{product.price} DH</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <div style={{ height: "50px" }}></div>
    </div>
  );
};

export default HomePage;
