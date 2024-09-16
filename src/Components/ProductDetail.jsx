import React, { useEffect, useState } from "react"; 
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../util/Firebase.jsx"; 
import { useParams } from "react-router-dom";
import "./WhatsappAnimation.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          const imageRef = ref(storage, `products/${productId}.jpg`);
          const imageUrl = await getDownloadURL(imageRef).catch((error) => {
            console.error("Error fetching product image:", error);
            return null; 
          });

          setProduct({ ...productData, imageUrl });
        } else {
          console.log("No such document!");
          setProduct(null); 
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  }

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=+34%20613%2082%2068%2058&text=Je%20suis%20intéressé%20par%20ce%20produit%20${encodeURIComponent(
    window.location.href
  )}`;

  return (
    <div className="font-sans bg-white">
      <br />
      <br />

     

      <div className="p-3 lg:max-w-6xl max-w-4xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-6 shadow-[0_2px_10px_-3px_rgba(190,24,93,1)] p-6 rounded-lg">
        
         {/* Product Image Section */}
<div className="lg:col-span-3 w-full flex items-center justify-center h-full">
  <img
    src={product.imageUrl || "placeholder.jpg"}
    alt={product.name || "Product"}
    className="w-full lg:w-3/4 rounded object-cover mx-auto"
  />



            {/* Additional Images */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 mx-auto">
              {(product.additionalImages || []).map((img, index) => (
                <div
                  key={index}
                  className="w-20 h-20 flex items-center justify-center rounded-lg p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] cursor-pointer"
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

          {/* Product Details Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold text-gray-800">
              {product.name || "Product Name"}
            </h2>

            <div className="flex space-x-2 mt-4">
              {[...Array(4)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 fill-pink-500 ${index < (product.rating || 0) ? "" : "fill-[#9D174D]"}`}
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

            <div className="flex flex-wrap gap-4 mt-4">
              <p className="text-gray-800 text-3xl font-bold">
                {product.price || "0.00"} DH
              </p>
              <p className="text-gray-400 text-base">
                <strike>{product.originalPrice || "0.00"}</strike>
                <span className="text-sm ml-1">Tax included</span>
              </p>
            </div>

            <div className="relative mt-4 lg:col-span-2 min-h-[200px]">
              <div className="whatsapp-button">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Acheter via Whatsapp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
