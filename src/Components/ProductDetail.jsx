import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../util/Firebase.jsx"; // Assurez-vous que le chemin est correct
import { useParams } from "react-router-dom";
import "./WhatsappAnimation.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Récupérer les détails du produit depuis Firestore
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();

          // Récupérer l'image du produit depuis Firebase Storage
          const imageRef = ref(storage, `products/${productId}.jpg`);
          const imageUrl = await getDownloadURL(imageRef).catch((error) => {
            console.error("Error fetching product image:", error);
            return null; // Gérer les erreurs, peut-être définir une image de remplacement
          });

          setProduct({ ...productData, imageUrl });
        } else {
          console.log("No such document!");
          setProduct(null); // Gérer le cas où le document n'existe pas
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null); // Gérer les erreurs
      }
    };

    fetchProduct();
  }, [productId]);

  // Gérer les cas où le produit pourrait être null ou les propriétés sont indéfinies
  if (!product) {
    return <p>Loading...</p>;
  }

  // Construire l'URL WhatsApp avec le lien du produit
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=+34%20613%2082%2068%2058&text=Je%20suis%20intéressé%20par%20ce%20produit%20${encodeURIComponent(
    window.location.href
  )}`;

  return (
    <div className="font-sans bg-white">
      <div className="p-4 lg:max-w-7xl max-w-4xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12 shadow-[0_2px_10px_-3px_rgba(190,24,93,1)] p-6 rounded-lg">
          <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
            <div className="px-4 py-10 rounded-lg shadow-[0_2px_10px_-3px_rgba(190,24,93,1)] relative">
              <img
                src={product.imageUrl || "placeholder.jpg"}
                alt={product.name || "Product"}
                className="w-3/4 rounded object-cover mx-auto"
              />
              <button type="button" className="absolute top-4 right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  fill="#ccc"
                  className="mr-1 hover:fill-[#333]"
                  viewBox="0 0 64 64"
                >
                  <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"></path>
                </svg>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 mx-auto">
              {(product.additionalImages || []).map((img, index) => (
                <div
                  key={index}
                  className="w-24 h-20 flex items-center justify-center rounded-lg p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Additional ${index}`}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <br />

            <h2 className="text-2xl font-extrabold text-gray-800">
              {product.name || "Product Name"}
            </h2>

            <div className="flex space-x-2 mt-4">
              {[...Array(4)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 fill-blue-600 ${
                    index < (product.rating || 0) ? "" : "fill-[#9D174D]"
                  }`}
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"></path>
                </svg>
              ))}
              <h4 className="text-gray-800 text-base">
                {product.reviewsCount} Reviews
              </h4>
            </div>
            <br />

            <div className="flex flex-wrap gap-4 mt-8">
              <p className="text-gray-800 text-3xl font-bold">
                {product.price || "0.00"} DH
              </p>
              <p className="text-gray-400 text-base">
                <strike>{product.originalPrice || "0.00"}</strike>
                <span className="text-sm ml-1">Tax included</span>
              </p>
            </div>
            <br />

            <div
              className="relative lg:col-span-2"
              style={{ minHeight: "200px" }}
            >
              {/* Votre contenu ici */}
              <div className="whatsapp-button">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Acheter via Whatsapp
                </a>
              </div>

              {/* <button type="button" className="min-w-[200px] px-4 py-2.5 border border-blue-600 bg-transparent hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded">
                Add to cart
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
