const newCarrito = async () => {
    try {
      if (localStorage.getItem("cart")) {
        return await JSON.parse(localStorage.getItem("cart"));
      } else {
        const response = await fetch("/api/carts/", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const data = await response.json();
        localStorage.setItem("cart", JSON.stringify(data));
  
        return data;
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };
  
  const getCartId = async () => {
    try {
      let cart = await newCarrito();
  
      return cart.id;
    } catch (error) {
      console.log("Error:" + error);
    }
  };
  
  const addProductToCart = async (pid) => {
    try {
      let cid = await getCartId();
      await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Product added to Cart: " + cid);
          cartAlert(cid);
        });
    } catch (error) {
      console.log("Error:" + error);
    }
  };
  
  const cartAlert = async (cid) => {
    Swal.fire({
      title: "<strong>Producto agregado al carrito</strong>",
      icon: "success",
      html: `Podes consultar los productos en el siguiente link:<a href=http://localhost:8080/carts/${cid}>Ver Carrito</a>`,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Continuar comprando'
    });
  };