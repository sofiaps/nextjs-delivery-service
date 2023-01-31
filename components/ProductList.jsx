import { Card, Button } from "react-bootstrap";
import Link from "next/link";
import { addProducts  } from "@/redux/cartSlice";
import { useDispatch } from "react-redux";

export default function ProductList({ products }) {
  const dispatch = useDispatch();
  const addToCart = (product) => {
    dispatch(addProducts({...product, qty:1}));
  };

  return (
    <>
      <div className="row row-cols-3">
        {products.map((product) => (
          <div key={product.name} className="mt-3 col">
            <Card>
              <Link href={`/products/${product.url}`} passHref>
                <Card.Img variant="top" src={product.image} />
              </Link>
              <Card.Body>
                <Card.Title>
                  {product.name} {product.price}€
                </Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Button variant="danger" onClick={() => addToCart(product)}>
                  Order
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <br></br>
    </>
  );
}
