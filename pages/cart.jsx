import { Table, CloseButton, Button, Card } from "react-bootstrap";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { removeProduct, emptyCart } from "@/redux/cartSlice";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const clientID =
    "ARq48c41Nv0YpxZKNjjyQjx0RXJ7wj0cYoSu3VK2nz9v5IRBKcBoMLANQ35N0qKAiUNOBTzztX2Y0VR6";
  const [checkout, setCheckout] = useState(false);
  const router = useRouter();

  const remove = (product) => {
    dispatch(removeProduct(product));
    toast.error(product.name + " has been removed!", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const addOrder = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/orders", data);
      if (res.status === 201) {
        dispatch(emptyCart());
        router.push(`/orders/${res.data._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const amount = cart.total.toFixed(2);
  const currency = "EUR";
  const style = { layout: "vertical" };
  // Custom component to wrap the PayPalButtons and handle currency changes
  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const customer = details.purchase_units[0].shipping;
              addOrder({
                customer: customer.name.full_name,
                address:
                  customer.address.address_line_1 +
                  ", " +
                  customer.address.admin_area_2,
                amount: cart.total,
                status: 0,
                payment: 1,
                products: cart.products.map((product) => ({
                  name: product.name,
                  qty: product.qty,
                  extras: product.extras.map((extra) => extra.text),
                })),
              });
            });
          }}
        />
      </>
    );
  };
  return (
    <motion.div
      initial={{ y: -300 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      {cart.cartQty === 0 ? (
        <h2>The cart is empty!</h2>
      ) : (
        <>
          <h1>Cart</h1>
          <div className="row mt-4">
            <div className="col-9">
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Extras</th>
                    <th>Qty.</th>
                    <th>Price</th>
                    <th>
                      <CloseButton disabled />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={50}
                          height={50}
                        />
                      </td>
                      <td>
                        <Link href={`/products/${product.url}`}>
                          {product.name}
                        </Link>
                      </td>
                      <td>
                        {product.extras.map((extra) => (
                          <span key={extra._id}>{extra.text} </span>
                        ))}
                      </td>
                      <td>{product.qty}</td>
                      <td>{(product.price * product.qty).toFixed(2)}</td>
                      <td>
                        <Button
                          className="btn-sm"
                          onClick={() => remove(product)}
                        >
                          x
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="col-3 p-2">
              <div className="shadow">
                <Card>
                  <Card.Header as="h5">Total</Card.Header>
                  <Card.Body className="text-center">
                    <Card.Title>{cart.total.toFixed(2)} EUR</Card.Title>
                    <Button variant="primary" onClick={() => setCheckout(true)}>
                      To checkout
                    </Button>
                    {checkout && (
                      <PayPalScriptProvider
                        options={{
                          "client-id": clientID,
                          components: "buttons",
                          currency: "EUR",
                        }}
                      >
                        <ButtonWrapper
                          currency={currency}
                          showSpinner={false}
                        />
                      </PayPalScriptProvider>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
