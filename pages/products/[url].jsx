import Link from "next/link";
import Image from "next/image";
import { ListGroup, Button, ListGroupItem } from "react-bootstrap";
import Product from "@/models/Product";
import mongodb from "@/utils/mongodb";
import { useState } from "react";
import { addProducts } from "@/redux/cartSlice";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

export default function ProductPage({ product }) {
  const [price, setPrice] = useState(product.price);
  const [extras, setExtras] = useState([]);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  const addExtra = (e, extra) => {
    const checked = e.target.checked;
    if (checked) {
      setPrice(price + extra.price);
      setExtras([...extras, extra]);
    } else {
      setPrice(price - extra.price);
      setExtras(extras.filter((allExtras) => allExtras._id !== extra._id));
    }
  };

  const addToCart = () =>{
      dispatch(addProducts({...product, extras, price, qty}))
  }

  if (!product) {
    return (
      <div>
        <h2>Product not found</h2>
      </div>
    );
  }

  return (
    <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 200 }}>
      <div>
        <Link href="/" className="text-dark">
          ← back to overview
        </Link>
      </div>
      <div className="row row-cols-2 mt-2">
        <div>
          <Image
            className="rounded-3"
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            layout="responsive"
          />
        </div>
        <div>
          <h1>{product.name}</h1>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2 className="text-danger">{price.toFixed(2)} €</h2>
            </ListGroupItem>
            <ListGroupItem>{product.description}</ListGroupItem>
            <ListGroupItem></ListGroupItem>
            <ListGroupItem>
              {product.extras.length ? "Extras: " : <p></p>}
              {product.extras.map((extra) => (
                <span key={extra._id}>
                  {extra.text}{" "}
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id={extra.text}
                    onChange={(e) => addExtra(e, extra)}
                  />
                </span>
              ))}
            </ListGroupItem>

            <ListGroupItem>
              <input
                className="form-control w-50"
                type="number"
                value={qty}
                min="1"
                max="100"
                onChange={(e) => setQty(e.target.value)}
              ></input>
            </ListGroupItem>
            <ListGroupItem>
              <div className="row shadow">
                <Button variant="danger" onClick={addToCart}>Add to Cart</Button>
              </div>
            </ListGroupItem>
          </ListGroup>
        </div>
      </div>
    </motion.div>
  );
}

export async function getServerSideProps(context) {
  const url = context.params.url;
  await mongodb.dbConnect();
  const product = await Product.findOne({ url }).lean();
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
